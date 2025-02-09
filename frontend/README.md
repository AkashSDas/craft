# Frontend

## Docker

```bash
# Build docker image
docker build -t craft:frontend -f Dockerfile .

# Run frontend container
docker run -d --name craft-frontend -p 3000:3000 --env-file .env craft:frontend       
```
