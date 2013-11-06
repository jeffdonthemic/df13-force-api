# Build your API with Force.com & Heroku

My Dreamforce 13 demo app.

## API Keys

You can add an API Key ("df13-force-api-key") to redis with:

```
hset api:keys df13-force-api-key jeff
```

Then pass the API Key in the Authorization header for each call:

```
Token="df13-force-api-key"
```