from flask import Flask, request, jsonify
from flask_cors import CORS
import heapq

app = Flask(__name__)
CORS(app)

# Define the graph (stations and times)
graph = {
    # Purple Line stations
    "KAFD": [("Ar Rabi", 6), ("Dr.Sulaiman Al Habib", 8), ("Al Murooj", 3)],
    "Ar Rabi": [("KAFD", 6), ("Uthman Bin Affan Road", 4)],
    "Uthman Bin Affan Road": [("Ar Rabi", 4), ("SABIC", 3)],
    "SABIC": [("Uthman Bin Affan Road", 3), ("Granadia", 6), ("PNU1", 5)],
    "Al Yarmuk": [("Granadia", 5), ("Al Hamra", 2)],
    "Al Hamra": [("Al Yarmuk", 2), ("Al Andalus", 3), ("Khalid Bin Alwaleed Road", 9), ("Al Khaleej", 2)],
    "Granadia": [("SABIC", 6), ("Al Yarmuk", 5)],
    "Al Andalus": [("Al Hamra", 3), ("Khurais Road", 3)],
    "Khurais Road": [("Al Andalus", 3), ("As Salam", 3)],
    "As Salam": [("Khurais Road", 3), ("An Naseem", 3)],
    "An Naseem": [("As Salam", 3), ("Hassan Bin Thabit Street", 3), ("Harun Ar Rashid Road", 3)],

    # Blue Line stations
    "SAB Bank": [("Dr.Sulaiman Al Habib", 3)],
    "Dr.Sulaiman Al Habib": [("SAB Bank", 3), ("KAFD", 8)],
    "Al Murooj": [("KAFD", 3), ("King Fahad District", 1)],
    "King Fahad District": [("Al Murooj", 1), ("King Fahad District 2", 6)],
    "King Fahad District 2": [("King Fahad District", 6), ("STC", 2)],
    "STC": [("King Fahad District 2", 2), ("Al Wurud 2", 1), ("Al-Wurud", 2), ("At Takhassusi", 4)],
    "Al Wurud 2": [("STC", 1), ("Al Urubah", 1)],
    "Al Urubah": [("Al Wurud 2", 1), ("Alinma Bank", 2)],
    "Alinma Bank": [("Al Urubah", 2), ("Bank Albilad", 1)],
    "Bank Albilad": [("Alinma Bank", 1), ("King Fahad Library", 1)],
    "King Fahad Library": [("Bank Albilad", 1), ("Ministry of Interior", 2)],
    "Ministry of Interior": [("King Fahad Library", 2), ("Al Murabba", 2)],
    "Al Murabba": [("Ministry of Interior", 2), ("Passport Department", 7)],
    "Passport Department": [("Al Murabba", 7), ("National Museum", 3)],
    "National Museum": [("Passport Department", 3), ("Al Bat'ha", 1), ("Ministry of Finance", 2)],
    "Al Bat'ha": [("National Museum", 1), ("Qasr Al Hokm", 13)],
    "Qasr Al Hokm": [("Al Bat'ha", 13), ("Al Owd", 10), ("Courts Complex", 12), ("Al Hilla", 19)],
    "Al Owd": [("Qasr Al Hokm", 10), ("Skirinah", 2)],
    "Skirinah": [("Al Owd", 2), ("Manfouhah", 1)],
    "Manfouhah": [("Skirinah", 1), ("Al Iman Hospital", 2)],
    "Al Iman Hospital": [("Manfouhah", 2), ("Transportation Center", 2)],
    "Transportation Center": [("Al Iman Hospital", 2), ("Al Aziziah", 3)],
    "Al Aziziah": [("Transportation Center", 3), ("Ad Dar Al Baida", 7)],
    "Ad Dar Al Baida": [("Al Aziziah", 7)],

    # Red Line stations
    "King Saud University": [("King Salman Oasis", 2)],
    "King Salman Oasis": [("King Saud University", 2), ("KACST", 1)],
    "KACST": [("King Salman Oasis", 1), ("At Takhassusi", 1)],
    "At Takhassusi": [("KACST", 1), ("STC", 4)],
    "Al-Wurud": [("STC", 2), ("King Abdulaziz Road", 1)],
    "King Abdulaziz Road": [("Al-Wurud", 1), ("Ministry of Education", 2)],
    "Ministry of Education": [("King Abdulaziz Road", 2), ("An Nuzhah", 2), ("King Salman Park", 2)],
    "An Nuzhah": [("Ministry of Education", 2), ("Riyadh Exhibition Center", 2)],
    "Riyadh Exhibition Center": [("An Nuzhah", 2), ("Khalid Bin Alwaleed Road", 3)],
    "Khalid Bin Alwaleed Road": [("Riyadh Exhibition Center", 3), ("Al Hamra", 9)],
    "Al Khaleej": [("Al Hamra", 2), ("Ishbiliyah", 2)],
    "Ishbiliyah": [("Al Khaleej", 2), ("King Fahad Sports City", 4)],
    "King Fahad Sports City": [("Ishbiliyah", 4)],

    # Orange Line stations
    "Jeddah Road": [("Tuwaiq", 3)],
    "Tuwaiq": [("Jeddah Road", 3), ("Ad Douh", 3)],
    "Ad Douh": [("Tuwaiq", 3), ("Western Station", 3)],
    "Western Station": [("Ad Douh", 3), ("Aishah bint Abi Bakr Street", 17)],
    "Aishah bint Abi Bakr Street": [("Western Station", 17), ("ADharat Al Badiah", 8)],
    "ADharat Al Badiah": [("Aishah bint Abi Bakr Street", 8), ("Sultanah", 5)],
    "Sultanah": [("ADharat Al Badiah", 5), ("Al Jarradiyah", 26)],
    "Al Jarradiyah": [("Sultanah", 26), ("Courts Complex", 25)],
    "Courts Complex": [("Al Jarradiyah", 25), ("Qasr Al Hokm", 12)],
    "Al Hilla": [("Qasr Al Hokm", 19), ("Al Margab", 19)],
    "Al Margab": [("Al Hilla", 19), ("As Salhiyah", 29)],
    "As Salhiyah": [("Al Margab", 29), ("First Industrial City", 39)],
    "First Industrial City": [("As Salhiyah", 39), ("Railway", 22)],
    "Railway": [("First Industrial City", 22), ("Al Malaz", 22)],
    "Al Malaz": [("Railway", 22), ("Jarir District", 23)],
    "Jarir District": [("Al Malaz", 23), ("Al Rajhi Grand Mosque", 1)],
    "Al Rajhi Grand Mosque": [("Jarir District", 1), ("Harun Ar Rashid Road", 2)],
    "Harun Ar Rashid Road": [("Al Rajhi Grand Mosque", 2), ("An Naseem", 3)],
    "Hassan Bin Thabit Street": [("An Naseem", 3), ("Khashm Al An", 3)],
    "Khashm Al An": [("Hassan Bin Thabit Street", 3)],

    # Yellow Line stations
    "Airport T1-2": [("Airport T3-4", 1)],
    "Airport T3-4": [("Airport T1-2", 1), ("Airport T5", 2)],
    "Airport T5": [("Airport T3-4", 2), ("PNU2", 10)],
    "PNU2": [("Airport T5", 10), ("PNU1", 3)],
    "PNU1": [("PNU2", 3)],

    # Green Line stations
    "King Salman Park": [("Ministry of Education", 2), ("As Sulimaniyah", 2)],
    "As Sulimaniyah": [("King Salman Park", 2), ("Ad Dhabab", 1)],
    "Ad Dhabab": [("As Sulimaniyah", 1), ("Abu Dhabi Square", 1)],
    "Abu Dhabi Square": [("Ad Dhabab", 1), ("Officers Club", 1)],
    "Officers Club": [("Abu Dhabi Square", 1), ("GOSI", 2)],
    "GOSI": [("Officers Club", 2), ("Al Wazarat", 1)],
    "Al Wazarat": [("GOSI", 1), ("Ministry of Defence", 1)],
    "Ministry of Defence": [("Al Wazarat", 1), ("King Abdulaziz Hospital", 1)],
    "King Abdulaziz Hospital": [("Ministry of Defence", 1), ("Ministry of Finance", 1)],
    "Ministry of Finance": [("King Abdulaziz Hospital", 1), ("National Museum", 2)],
}

def dijkstra(graph, start, end):
    queue = [(0, start, [])]  
    visited = set()

    while queue:
        total_time, current, path = heapq.heappop(queue)

        if current == end:
            return path + [current], total_time

        if current in visited:
            continue

        visited.add(current)

        for neighbor, time in graph[current]:
            if neighbor not in visited:
                heapq.heappush(queue, (total_time + time, neighbor, path + [current]))

    return None, None

@app.route("/find_route", methods=["POST"])
def find_route():
    data = request.json
    location = data["location"]
    destination = data["destination"]

    print("Received request with:", location, destination) 

    route, time = dijkstra(graph, location, destination)

    if route:
        return jsonify({"route": " -> ".join(route), "time": time})
    else:
        return jsonify({"error": "No route found."})

if __name__ == "__main__":
    app.run(debug=True)