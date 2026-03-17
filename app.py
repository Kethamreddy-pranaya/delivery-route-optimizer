from flask import Flask, render_template, request
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from geopy.exc import GeocoderTimedOut
import time

app = Flask(__name__)

geolocator = Nominatim(user_agent="delivery_optimizer")


def get_coordinates(address):
    for _ in range(3):
        try:
            location = geolocator.geocode(address, timeout=10)
            if location:
                return (location.latitude, location.longitude)
        except GeocoderTimedOut:
            time.sleep(1)
    return None


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/optimize", methods=["POST"])
def optimize():

    addresses = request.form["locations"].split("\n")

    locations = []

    for address in addresses:
        coord = get_coordinates(address)
        time.sleep(1)
        if coord:
            locations.append(coord)

    distances = []

    for i in range(len(locations)-1):

        start = locations[i]
        end = locations[i+1]

        d = geodesic(start, end).km

        distances.append(round(d,2))

    return render_template(
        "result.html",
        coords=locations,
        distances=distances
    )


if __name__ == "__main__":
    app.run(debug=True)