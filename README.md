# Welcome to the [Nasa Apod Viewer](https://apod-nasa-viewer.vercel.app/) Project.

A Python web application for fetching NASA's Astronomy Picture of the Day, shareable as APOD cards.

Visit the live app: [apod-nasa-viewer.vercel.app](https://apod-nasa-viewer.vercel.app)

## About

This project is a Python web application built with Flask. It fetches NASA's Astronomy Picture of the Day (APOD) from the NASA API and provides functionalities to view and share the images as APOD cards.

## Features

- Fetches the Astronomy Picture of the Day from the NASA API.
- Enables users to explore APOD images via a calendar navigation or by searching for specific dates.
- Includes a 'Shuffle' option that randomize picks for users who are uncertain which date to explore.
- Showcases a curated selection of the finest APOD images from 1995 (the inception year of APOD) to the present via the 'Featured NASA APOD per year' Recommendations section.
- Generates shareable APOD cards comprising the retrieved image, title, and description.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Feedback & Support](#feedback--support)
- [License](#license)

## Installation

To run this project locally, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/imprvhub/nasa-apod-viewer.git
   ```

2. Install the required dependencies:

    ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables. Ensure you have a .env file with the following variables:

     ```bash
    NASA_API_KEY: Your NASA API key.
    DATABASE_HOST: Hostname of your database.
    DATABASE_USERNAME: Username for database access.
    DATABASE_PASSWORD: Password for database access.
    DATABASE: Name of the database.
   ```

4. Run the Flask application:
    ```bash
   cd api
   python3 index.py
   ```

## Usage

Once the application is running locally, you can access it in your web browser at 'http://localhost:5000/'.

## Feedback & Support

Your feedback is valuable! If you encounter any issues or have suggestions for improvements, please create a new GitHub issue in this repository.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

