# Import dependencies and setup
import os
import json
import requests
from bson import json_util
from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
import cancer_scrape # Bringing in cancer_scrape.py file
import pandas as pd
import geojson
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*"
    }
})
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['CORS_ORIGINS'] = '*'

# Use flask_pymongo to set up local MongoDB connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/cancer_app" 
mongo = PyMongo(app)

# Creating app route "/" and defining function
@app.route("/")
@cross_origin()
def index():
    cancer_data = mongo.db.cancer_data.find_one()
    return render_template("index.html", cancer_data = cancer_data)

# Route to get cancer incidence geoJSON data
@app.route("/cancer_dash/", methods = ["GET"])
@cross_origin()
def index2():
    all_cancers = mongo.db.all_cancers

    # Dropping collection if exists to remove duplicates
    all_cancers.drop()

    # Loading geoJSON file
    with open("Data/US_cancer_state.geojson") as file:
        file_data = geojson.load(file)
    # Inserting data into collection
    if isinstance(file_data, list):
        all_cancers.insert_many(file_data)
    else:
        all_cancers.insert_one(file_data)

    # Finding cancer incidence data
    all_cancers2 = all_cancers.find_one()

    # Parsing JSON string into python dictionary, returning string
    cancerjson = json.loads(json_util.dumps(all_cancers2))
    
    return jsonify(cancerjson)

# Route to get mortality data
@app.route("/cancer_mortality/", methods = ["GET"])
@cross_origin()
def index3():
    mortality = mongo.db.mortality

    # Dropping collection if exists to remove duplicates
    mortality.drop()

    # Loading JSON file
    with open("Data/cancer_mortality_final.json") as file:
        file_data_mort = json.load(file)
    # Inserting data into collection
    if isinstance(file_data_mort, list):
        mortality.insert_many(file_data_mort)
    else:
        mortality.insert_one(file_data_mort)

    # Finding cancer mortality data
    mortality2 = mortality.find()

    # Parsing JSON string into python dictionary, returning string
    mortalityjson = json.loads(json_util.dumps(mortality2))
    return jsonify(mortalityjson)

# Creating app route "/scrape" and defining function 
# Updating MongoDB with scraped data - route for loading data in
@app.route("/scrape")
@cross_origin()
def scraper():
    cancer_data = mongo.db.cancer_data
    cancer_data2 = cancer_scrape.scrape()
    cancer_data.update({}, cancer_data2, upsert=True)
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)
