Let me search for documentation about building custom images.

Ran tool


Based on the search results, I can help you build your own image to GitHub Container Registry. Here's a step-by-step guide:

1. First, you'll need to set up GitHub Container Registry access:
   - Create a Personal Access Token (PAT) with these scopes:
     - `read:packages`
     - `write:packages`
     - `delete:packages`
   - Go to GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic) to create the token
   - Copy the token for later use

2. Login to GitHub Container Registry:
```bash
docker login ghcr.io -u YOUR_GITHUB_USERNAME
# Enter your PAT when prompted for password
```

3. Build your image:
```bash
# Build the image
sudo docker build -t ghcr.io/gabrieldeholanda/airys-video:demo -f docker/main/Dockerfile .
```

4. Push the image to GitHub Container Registry:
```bash
sudo docker push ghcr.io/gabrieldeholanda/airys-video:demo
```

5. Configure repository package settings:
   - Go to your repository settings
   - Navigate to "Packages"
   - Ensure the package visibility is set appropriately (public or private)
   - If private, make sure you've granted access to the necessary users/organizations

If you're having issues with the build platform, you can specify it explicitly:

```bash
# First, enable buildx (recommended builder)
docker buildx create --use

# Then build the image with platform specified
docker buildx build --platform linux/amd64 \
  -t ghcr.io/YOUR_GITHUB_USERNAME/airys-video:latest \
  -f docker/main/Dockerfile \
  --push .
```

For ARM-based systems (like Raspberry Pi), use:
```bash
docker buildx build --platform linux/arm64 \
  -t ghcr.io/YOUR_GITHUB_USERNAME/airys-video:latest \
  -f docker/main/Dockerfile \
  --push .
```

Common issues and solutions:
1. If the image hasn't been pushed to the registry
2. If the package permissions aren't set correctly
3. If your PAT doesn't have the correct scopes

Let me know if you run into any specific issues and I'll help you troubleshoot them!
