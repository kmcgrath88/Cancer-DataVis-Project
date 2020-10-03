#Import dependencies and setup
from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import cancer_scrape #Bringing in mars_scrape.py file

app = Flask(__name__)

#Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/cancer_app" 
mongo = PyMongo(app)

#Creating app route "/" and defining function
@app.route("/")
def index():
    cancer_data = mongo.db.cancer_data.find_one()
    return render_template("index.html", cancer_data = cancer_data)

#Creating app route "/scrape" and defining function
@app.route("/scrape")
def scraper():
    cancer_data  = mongo.db.cancer_data 
    cancer_data2 = cancer_scrape.scrape()
    cancer_data.update({}, cancer_data2, upsert=True)
    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)
