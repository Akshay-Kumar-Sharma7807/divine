# Assistant App

This is a React Native application that allows users to interact with an assistant through chat. The assistant can process user inputs, provide responses, and handle file uploads.

## Features

- Chat with an assistant
- Provide optional instructions to the assistant
- Upload files for the assistant to process
- Copy chat responses to clipboard
- Clear chat history

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd <project-directory>
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

## Usage

1. Start the development server:
   ```sh
   npm start
   ```
2. Run the app on your device or emulator:
   ```sh
   npm run android
   # or
   npm run ios
   ```

## Project Structure

- [src](http://_vscodecontentref_/0): Contains the source code for the application
  - `components/`: Reusable components
  - `screens/`: Application screens
    - [assistant.tsx](http://_vscodecontentref_/1): Main screen for interacting with the assistant
  - `context.tsx`: Context providers
  - `navigation/`: Navigation setup
  - [theme.ts](http://_vscodecontentref_/2): Theme configuration
  - `utils.ts`: Utility functions
- [assets](http://_vscodecontentref_/3): Contains static assets like images and fonts
- [constants.ts](http://_vscodecontentref_/4): Application constants
- [types.ts](http://_vscodecontentref_/5): Type definitions

## API Endpoints

The app interacts with the following API endpoints:

- `POST /chat/create-assistant`: Create a new assistant
- `POST /chat/run-status`: Check the status of a chat thread
- `POST /chat/get-thread-messages`: Retrieve messages from a chat thread

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
