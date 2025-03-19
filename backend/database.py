import mongoengine as me
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Connect to MongoDB
db_client = me.connect('support_ticketing', alias='app', host=MONGO_URI, uuidRepresentation='standard')
