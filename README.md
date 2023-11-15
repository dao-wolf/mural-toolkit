# Mural Tooklit

## Description
Mural Toolkit is a Node.js application designed to export all murals (boards) from a specified workspace in Mural, a digital workspace for visual collaboration. This tool streamlines data migration and management by efficiently fetching and exporting mural data from Mural.

## Prerequisites
Before using this application, you should have:
- [Node.js](https://nodejs.org/en/download/) installed on your computer.
- [Yarn](https://yarnpkg.com/getting-started/install) package manager (an alternative to npm).
- Access to Mural API with a valid API key and a workspace ID.
- Basic knowledge of command-line interfaces and Postman.

## Installation

### Step 1: Clone the Repository
Clone this repository to your local machine using:
```
git clone git@github.com:dao-wolf/mural-toolkit.git
```
or download the repository as a ZIP file.

### Step 2: Install Dependencies
Navigate to the cloned directory in your command line and execute:
```
yarn install
```
This will install all necessary Node.js dependencies for the application.

### Step 3: Configure Environment Variables
Create a `.env` file in the project's root directory and add your Mural API key and workspace ID:
```
MURAL_API_KEY=your_mural_api_key
QMETRIC_WS_ID=your_workspace_id
```
Replace `your_mural_api_key` and `your_workspace_id` with your actual Mural API key and workspace ID.

## Create and Register Mural App
Instructions can be found [here](https://developers.mural.co/public/docs/register-your-app).

## Using Postman to Authenticate
As a stop gap solution using postman to authenticate and refresh the token, follow instructions [here](https://developers.mural.co/public/docs/testing-with-postman).
It's important to note that the primary redirect URL mentioned [here](https://developers.mural.co/public/docs/access-page) should be `https://oauth.pstmn.io/v1/callback`


### Generating Bearer Token using Postman
To generate a bearer token using Postman:

1. Open Postman and create a new request.
2. Set the request type to `POST` and enter the token generation URL for Mural's API.
3. In the 'Body' section of the request, input the necessary credentials (usually client ID and client secret).
4. Send the request, and you will receive a response that includes the bearer token.
5. Copy the bearer token and paste it into your `.env` file as the value for `MURAL_API_KEY`.

Note: The exact steps and parameters may vary based on Mural's authentication process.

## Usage

### Starting the Application
To start the application, run:
```
yarn start
```
This command will execute the application using the provided configurations.

### Exporting Murals
The application will automatically fetch and export all murals from the workspace ID specified in the `.env` file.

## Troubleshooting

### Common Issues and Solutions
- **API Key and Workspace ID**: Ensure that the API key and workspace ID in the `.env` file are correct and valid.
- **File Permissions**: If file writing errors occur, verify that the application has write permissions in the designated directory.
- **Network Connection**: A stable internet connection is required for the application to connect to Mural's servers.

## Further Assistance
Internal use: For further assistance, please contact the author of this repository.
