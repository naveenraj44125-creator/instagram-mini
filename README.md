# Instagram Mini

A minimal Instagram-like social media application built with React and Node.js, featuring S3 integration for file uploads and AWS Lightsail deployment.

## Features

- **User Authentication**: Simple username-based login system
- **Photo Sharing**: Upload images directly to AWS S3 bucket
- **Social Features**: Like posts, add comments, view feed
- **Instagram-like UI**: Clean, responsive design similar to Instagram
- **Real-time Updates**: Dynamic feed with instant interactions

## Technology Stack

- **Frontend**: React, React Icons, Axios
- **Backend**: Node.js, Express.js
- **File Storage**: AWS S3 (using Multer-S3)
- **Deployment**: AWS Lightsail

## Local Development Setup

1. **Clone and Install Dependencies**
   ```bash
   cd instagram-mini
   npm install
   cd client && npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your AWS credentials:
   ```
   PORT=3001
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your-s3-bucket-name
   ```

3. **Run the Application**
   ```bash
   # Terminal 1: Start the backend server
   npm run dev
   
   # Terminal 2: Start the React client (in development)
   cd client && npm start
   ```

4. **Access the Application**
   - Development: http://localhost:3000 (React dev server)
   - Production: http://localhost:3001 (Express serves built React app)

## AWS S3 Setup

1. Create an S3 bucket for image storage
2. Configure bucket permissions for public read access
3. Set up IAM user with S3 permissions
4. Add credentials to `.env` file

## Deployment to AWS Lightsail

This project includes intelligent deployment configuration for AWS Lightsail using the MCP deployment tools.

### Automatic Deployment Setup

The project will be analyzed and deployed automatically using the intelligent deployment system that:
- Detects the Node.js/React application structure
- Configures S3 integration
- Sets up Lightsail instance with appropriate size
- Configures SSL and security settings
- Sets up monitoring and health checks

### Manual Deployment Steps

If deploying manually:

1. **Build the React App**
   ```bash
   cd client && npm run build
   ```

2. **Deploy to Lightsail**
   - Use the included deployment configuration
   - Ensure environment variables are set on the server
   - Configure S3 bucket access

## Project Structure

```
instagram-mini/
├── server.js              # Express server with API routes
├── package.json           # Server dependencies
├── .env.example           # Environment variables template
├── client/                # React frontend
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Instagram-like styles
│   │   └── components/    # React components
│   │       ├── Header.js      # Navigation header
│   │       ├── Login.js       # Authentication
│   │       ├── Feed.js        # Post feed
│   │       ├── Post.js        # Individual post
│   │       └── PostForm.js    # Create new post
│   └── package.json       # Client dependencies
└── README.md              # This file
```

## API Endpoints

- `GET /api/posts` - Fetch all posts
- `POST /api/posts` - Create new post (with image upload)
- `POST /api/posts/:id/like` - Like/unlike a post
- `POST /api/posts/:id/comments` - Add comment to post
- `GET /api/users/:username` - Get user profile
- `GET /api/health` - Health check endpoint

## Security Features

- File type validation (images only)
- File size limits (10MB max)
- Input sanitization
- CORS configuration
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
