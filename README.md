# Welcome to the [Nasa Apod Viewer](https://apod-nasa-viewer.vercel.app/) Project.

This project is a Python web application built with Flask. It fetches NASA's Astronomy Picture of the Day (APOD) from the NASA API and provides functionalities to view and share the images as APOD cards.

Visit the live app: [apod-nasa-viewer.vercel.app](https://apod-nasa-viewer.vercel.app)

## Key Features

- Fetches the Astronomy Picture of the Day from the NASA API.
- Enables users to explore APOD images via a calendar navigation or by searching for specific dates.
- Includes a 'Shuffle' option that randomize picks for users who are uncertain which date to explore.
- Showcases a curated selection of the finest APOD images from 1995 (the inception year of APOD) to the present via the 'Featured NASA APOD per year' Recommendations section.
- Generates shareable APOD cards comprising the retrieved image, title, and description.

## Installation and Usage

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
   Then it should be accessible at
    ```bash
   http://localhost:5000/
   ```


## Feedback & Support
Your input matters, and I'm ready to help address any inquiries or feedback you may have. Your contributions are essential for refining the project and enhancing the overall user experience. Don't hesitate to get in touch with me:

Feel free to share your insights, recommendations, or suggestions for continuous improvement. If you encounter any challenges or require assistance, please [create a new GitHub issue](https://github.com/imprvhub/nasa-apod-viewer/issues/new). Be sure to provide a detailed description of your issue to facilitate prompt and precise support.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/imprvhub/nasa-apod-viewer/blob/main/LICENSE.md) file for details.

