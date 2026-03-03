# DealDiscover — MongoDB Setup Guide

## Step 1: Create a MongoDB Atlas Account

1. Go to **[cloud.mongodb.com](https://cloud.mongodb.com)**
2. Click **"Try Free"**
3. Sign up with Google or email
4. Complete the quick onboarding (select "Free" tier)

---

## Step 2: Create a Free Cluster

1. Click **"Build a Database"**
2. Select **M0 FREE** (Shared) — this is free forever
3. Choose **Provider**: AWS
4. Choose **Region**: `Mumbai (ap-south-1)` for best speed in India
5. Cluster name: `DealDiscover` (or leave default)
6. Click **"Create Deployment"**

---

## Step 3: Create a Database User

A popup will appear after creating the cluster:

1. **Username**: `dealdiscover`
2. **Password**: Click "Autogenerate Secure Password" and **copy it somewhere safe**
3. Click **"Create Database User"**

> [!CAUTION]
> Save the password now — you can't see it again later!

---

## Step 4: Whitelist Your IP

Still on the same popup:

1. Click **"Add My Current IP Address"** (this allows your computer to connect)
2. For development, you can also add `0.0.0.0/0` to allow all IPs
3. Click **"Finish and Close"**

---

## Step 5: Get Your Connection String

1. On the cluster page, click **"Connect"**
2. Select **"Drivers"**
3. You'll see a string like:

```
mongodb+srv://dealdiscover:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

4. **Replace `<password>`** with the password from Step 3
5. **Add database name** before the `?`:

```
mongodb+srv://dealdiscover:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/dealdiscover?retryWrites=true&w=majority
```

---

## Step 6: Create the `.env` File

Create the file `server/.env` in your project:

```env
MONGODB_URI=mongodb+srv://dealdiscover:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/dealdiscover?retryWrites=true&w=majority
JWT_SECRET=paste_a_random_string_here
PORT=5000
CLIENT_URL=http://localhost:8080
```

> [!TIP]
> To generate a secure JWT_SECRET, run this in your terminal:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```
> Copy the output and paste it as JWT_SECRET.

---

## Step 7: Seed & Start

```bash
cd d:/Projects/deal-discover-tool
npm run seed:locations    # Populates 27 Indian cities
npm start                 # Starts server + frontend
```

You should see:
```
[server] ✓ Connected to MongoDB
[server] ✓ Server running on http://localhost:5000
[client] VITE ready in 300ms → http://localhost:8080
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `uri parameter must be a string` | `server/.env` is missing or `MONGODB_URI` is not set |
| `Authentication failed` | Wrong password in the connection string |
| `IP not whitelisted` | Go to Atlas → Network Access → Add your IP |
| `ECONNREFUSED` | Backend isn't running — run `npm start` |
