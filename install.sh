#!/bin/bash

echo "Installing CodeShare Application..."
echo

echo "Installing backend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing backend dependencies"
    exit 1
fi

echo
echo "Installing frontend dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "Error installing frontend dependencies"
    exit 1
fi
cd ..

echo
echo "Installation completed successfully!"
echo
echo "To start the application, run: npm run dev"
echo
echo "The application will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
echo 