## 1. Generate ECDSA private key :

```bash
openssl ecparam -name prime256v1 -genkey -noout -out ec-private.pem
```

## 2. Generate ECDSA public key :

```bash
openssl ec -in ec-private.pem -pubout -out ec-public.pem
```

## 3. Paste both file ".pem" inside config

/!\ For production environment need to use secrets manager to store keys (AWS Secret Manager, etc.)
