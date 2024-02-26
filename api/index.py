import datetime
from datetime import date
import logging
import os
from functools import wraps
from io import BytesIO
import string 
import pymysql
import random
import requests
from PIL import Image
from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, render_template, request
from hashids import Hashids

load_dotenv()

app = Flask(__name__)
domain_url = "https://apod-nasa-viewer.vercel.app"
hashids_salt = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
hashids = Hashids(salt=hashids_salt, min_length=4)
connection = pymysql.connect(
        host=os.getenv("DATABASE_HOST"),
        user=os.getenv("DATABASE_USERNAME"),
        passwd=os.getenv("DATABASE_PASSWORD"),
        db=os.getenv("DATABASE"),
        ssl={"ssl_accept": "strict"}
    )

with connection.cursor() as cursor:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS urls (
                id INT AUTO_INCREMENT PRIMARY KEY,
                original_url VARCHAR(255) NOT NULL,
                short_url VARCHAR(255) NOT NULL
            )
        """)

class NasaApiException(Exception):
    """Raised for any exception caused by a call to the Nasa API"""

class RateLimitException(NasaApiException):
    """Raised when you have exceeded your rate limit"""

def api_get(url, payload):
    payload = dict((k, v) for k, v in payload.items() if v)
    payload['api_key'] = api_key()
    response = requests.get(url, params=payload)
    if response.status_code == 429:
        raise RateLimitException('You have exceeded your rate limit')
    response.raise_for_status()
    body = response.json()
    if 'error' in body:
        raise NasaApiException(body['error'])

    ratelimit_limit = int(response.headers['x-ratelimit-limit'])
    ratelimit_remaining = int(response.headers['x-ratelimit-remaining'])
    percent = ratelimit_remaining / ratelimit_limit
    if percent < 0.1:
        api_logger().warn(
            "Only {:3.1f}% of your rate limit is remaining!".format(percent * 100)
        )

    return body

def external_api_get(url, payload):
    payload = dict((k, v) for k, v in payload.items() if v)
    response = requests.get(url, params=payload)
    response.raise_for_status()
    body = response.json()
    return body

def api_key():
    return os.environ["NASA_API_KEY"]

def api_logger():
    return logging.getLogger('nasa_logger')

def optional(validator):
    '''Mark a validation as optional (allow None)'''
    @wraps(validator)
    def wrapper(*args, **kwargs):
        value = args[0]
        return None if value is None else validator(*args, **kwargs)
    return wrapper

@optional
def optional_date(input):
    return nasa_date(input)

def nasa_date(input):
    try:
        datetime.datetime.strptime(input, '%Y-%m-%d')
        return input
    except ValueError:
        raise ValueError('Incorrect date format, should be YYYY-MM-DD')

@optional
def optional_int(input):
    return nasa_int(input)

def nasa_int(input):
    if isinstance(input, int):
        return input
    raise ValueError('Expected an int')

@optional
def optional_float(input):
    return nasa_float(input)

def nasa_float(input):
    if isinstance(input, float):
        return input
    raise ValueError('Expected a float')

class NasaApiObject(object):
    def __init__(self, **kwargs):
        for prop in self.Meta.properties:
            val = None
            if prop in kwargs:
                val = kwargs[prop]
            setattr(self, '{0}'.format(prop), val)

    @classmethod
    def from_response(cls, response):
        kwargs = {}
        for prop in cls.Meta.properties:
            try:
                kwargs[prop] = response[prop]
            except KeyError:
                pass
        return cls(**kwargs)

def apod(date=None, concept_tags=None):
    payload = {
        'date': optional_date(date),
        'concept_tags': concept_tags,
    }
    return Apod.from_response(api_get(
        'https://api.nasa.gov/planetary/apod',
        payload,
    ))

class Apod(NasaApiObject):
    """NASA's Astronomy Picture of the Day"""
    class Meta(object):
        properties = ['url', 'title', 'explanation', 'concepts']

    def __init__(self, **kwargs):
        super(Apod, self).__init__(**kwargs)
        self._image = None
        if self.concepts is not None:
            self.concepts = self.concepts.values()

    @property
    def image(self):
        if self._image is None:
            self._image = Image.open(BytesIO(requests.get(self.url).content))
        return self._image
    
@app.route('/')
def apod_images():
    params = request.args
    if not params:
        today = date.today().strftime('%Y-%m-%d')
        picture = apod('2024-02-25')
        return render_template('index.html', images=[picture])

@app.route('/update_image')
def update_image():
    try:
        selected_date = request.args.get('date')
        picture = apod(selected_date)
        return jsonify({'url': picture.url, 'title': picture.title, 'explanation': picture.explanation})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Image not found'}), 404
        
@app.route('/preview', methods=['GET', 'POST'])
def card_preview():
    if request.method == 'POST':
        original_url = request.form.get('original_url')
        short_url_id = random.randint(1000, 9999) 
        short_url = "https://apod-nasa-viewer.vercel.app/" + hashids.encode(short_url_id)
        save_to_database(original_url, short_url)
        return jsonify({'short_url': short_url})
    else:
        try:
            selected_date = request.args.get('date')
            picture = apod(selected_date)
            imageUrl = picture.url
            imageTitle = picture.title
            imageDescription = 'Description: ' + picture.explanation
            return render_template('preview.html', image_url=imageUrl, title=imageTitle, description=imageDescription)
        except Exception as e:
            print(f"Error: {str(e)}")
            return render_template('preview.html', image_url='', title='', description='')

def save_to_database(original_url, short_url):
    with connection.cursor() as cursor:
        cursor.execute("INSERT INTO urls (original_url, short_url) VALUES (%s, %s)", (original_url, short_url))
    connection.commit()

@app.route('/<short_code>')
def redirect_to_original_url(short_code):
    with connection.cursor() as cursor:
        cursor.execute("SELECT original_url FROM urls WHERE short_url = %s", (f"{domain_url}/{short_code}",))
        result = cursor.fetchone()
        if result:
            original_url = result[0]
            return redirect(original_url)
        else:
            return "URL no encontrada", 404

@app.route('/user_agreements')
def user_agreements():
    return render_template('user_agreements.html')

if __name__ == '__main__':
    app.run(debug=True)
