#Import dependencies and setup
import os
import json
import requests
from bson import json_util
from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
import cancer_scrape #Bringing in cancer_scrape.py file
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

#Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/cancer_app" 
mongo = PyMongo(app)

#Creating app route "/" and defining function ---- this works
# @app.route("/cancer_scrape/")
@app.route("/")
@cross_origin()
def index():
    cancer_data = mongo.db.cancer_data.find_one()
    # cancerjson = json.loads(json_util.dumps(cancer_data))
    # print(cancerjson)
    # return jsonify(cancerjson)
    return render_template("index.html", cancer_data = cancer_data)

# Route to get geojson data -- testing
@app.route("/cancer_dash/", methods = ["GET"])
@cross_origin()
def index2():
    
    all_cancers = mongo.db.all_cancers
    # Drops collection if available to remove duplicates
    all_cancers.drop()
    # Loading json file
    with open("Data/US_cancer_state.geojson") as file:
        file_data = geojson.load(file)
    #insert data into collection
    if isinstance(file_data, list):
        all_cancers.insert_many(file_data)
    else:
        all_cancers.insert_one(file_data)

    all_cancers2 = all_cancers.find_one()
    cancerjson = json.loads(json_util.dumps(all_cancers2))
    # print(jsonify(cancerjson))
    return jsonify(cancerjson)
    # return render_template("index.html", all_cancers = all_cancers2)

# Route to get mortality data
@app.route("/cancer_mortality/", methods = ["GET"])
@cross_origin()
def index3():
    
    mortality = mongo.db.mortality
    # Drops collection if available to remove duplicates
    mortality.drop()
    # Loading json file
    with open("Data/cancer_mortality_final.json") as file:
        file_data_mort = json.load(file)
    #insert data into collection
    if isinstance(file_data_mort, list):
        mortality.insert_many(file_data_mort)
    else:
        mortality.insert_one(file_data_mort)

    mortality2 = mortality.find()
    mortalityjson = json.loads(json_util.dumps(mortality2))
    # print(jsonify(cancerjson))
    return jsonify(mortalityjson)

#Creating app route "/scrape" and defining function  -- updating mongodb with scraped data; route for loading data in
@app.route("/scrape")
@cross_origin()
def scraper():
    cancer_data = mongo.db.cancer_data


    # all_cancers = mongo.db.all_cancers
    # # Drops collection if available to remove duplicates
    # all_cancers.geojson.drop()
    # # Loading json file
    # with open("Data/US_cancer_state.geojson") as file:
    #     file_data = geojson.load(file)
    # #insert data into collection
    # if isinstance(file_data, list):
    #     all_cancers.insert_many(file_data)
    # else:
    #     all_cancers.insert_one(file_data)
    # cancer_data  = mongo.db.cancer_data 

    cancer_data2 = cancer_scrape.scrape()
    cancer_data.update({}, cancer_data2, upsert=True)
    return redirect("/")





if __name__ == "__main__":
    app.run(debug=True)
