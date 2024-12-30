# New Year's Eve

This project is a web application that displays a countdown to New Year's Eve with fireworks and background images. The application is built using HTML, CSS, and JavaScript, and it can be deployed as a Docker container using Nginx.

## Features

- Countdown to New Year's Eve
- Fireworks display
- Configurable background images
- Configurable countdown position, scale, and rotation

## Getting Started

### Prerequisites

- Docker

### Running Locally

To run the application locally using Docker, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/Mr-Comand/NewYearsEve.git
   cd NewYearsEve
   ```
2. Build the Docker image:
```sh
docker build -t newyearseve .
```
3. Run the Docker container:
```sh
docker build -t newyearseve .
```
4. Open your browser and navigate to http://localhost:80 to see the application.
```sh
docker run -p 80:80 newyearseve
```
## GitHub Actions
This project uses GitHub Actions to build and push the Docker image to GitHub Container Registry. The workflow is triggered on push to version tags (e.g., `v1.0.0`) and can also be manually triggered.

## Docker Image
The Docker image for this project is available on GitHub Container Registry:

* `ghcr.io/mr-comand/newyearseve:latest`

# Configuration
The application includes a configuration menu that allows you to:

* Hide background images
* Adjust the countdown position
* Scale the countdown
* Rotate the countdown


# License
This project is licensed under the MIT License. See the LICENSE file for details.