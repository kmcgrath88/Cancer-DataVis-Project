#Import dependencies and setup
import json
import requests
from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import cancer_scrape #Bringing in cancer_scrape.py file
import geopandas

app = Flask(__name__)
#Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/cancer_app" 
mongo = PyMongo(app)

#Creating app route "/" and defining function ---- this works
# @app.route("/")
# def index():
#     cancer_data = mongo.db.cancer_data.find_one()
#     return render_template("index.html", cancer_data = cancer_data)

#Route to get geojson data -- testing
@app.route("/", methods = ["GET"])
#@cross_origin()
def index():
    # mars_data = scrape_mars.scrape_all()
    # mars.update({}, mars_data, upsert=True)
#     alldogs = dogdb.find({})
#     dogsjson = json.loads(json_util.dumps(alldogs))

   
    all_cancers = mongo.db.all_cancers
    response = geopandas.read_file("Data/US_cancer_state.geojson")
    
    all_cancers.insert(response)
    return render_template("index.html", all_cancers = all_cancers)

#Creating app route "/scrape" and defining function
@app.route("/scrape")
def scraper():
    cancer_data  = mongo.db.cancer_data 
    cancer_data2 = cancer_scrape.scrape()
    cancer_data.update({}, cancer_data2, upsert=True)
    return redirect("/")




if __name__ == "__main__":
    app.run(debug=True)
