import React from "react";
import SignCard from "./SignCard.js";
import "./TrafficRules.css";

const trafficSigns = [
  { image: "/images/stop.jpg", text: "STOP - Must come to a complete stop" },
  { image: "/images/noentry.jpg", text: "NO ENTRY - Do not proceed beyond this point" },
  { image: "/images/noparking.jpg", text: "NO PARKING - Stopping or parking here is prohibited" },
  { image: "/images/nouturn.jpg", text: "NO U-TURN - Making a U-turn is prohibited." },
  { image: "/images/speedlimit.jpg", text: "SPEED LIMIT - Do not exceed the maximum speed indicated on the sign." },

  { image: "/images/nohorn.jpg", text: "NO HORN - Honking is prohibited in this area. Maintain a quiet zone." },
  { image: "/images/trafficsignalahead.jpg", text: "TRAFFIC SIGNAL AHEAD - Be prepared to stop or proceed as per the traffic light signals." },
  { image: "/images/norightturn.jpg", text: "NO RIGHT TURN - Turning right is prohibited at this location." },
  { image: "/images/noleftturn.jpg", text: "NO LEFT TURN - Turning left is prohibited at this location." },
  { image: "/images/nostraight.jpg", text: "NO STRAIGHT - Going straight is prohibited beyond this point." },

  { image: "/images/noovertake.jpg", text: "NO OVERTAKE - Overtaking other vehicles is prohibited in this zone." },
  { image: "/images/traintrack.jpg", text: " TRAIN TRACK AHEAD - Caution! Railway crossing ahead. Slow down and be prepared to stop." },
  { image: "/images/pedestrain.jpg", text: "PEDESTRIAN CROSSING - Watch for pedestrians. Slow down and give way to people crossing the road." },
  { image: "/images/narrowroad.jpg", text: "NARROW ROAD AHEAD - Road ahead becomes narrower. Drive cautiously and be prepared to adjust your speed." },
  { image: "/images/nohorn.jpg", text: "NO HORN - Silent zone, avoid honking" },

  { image: "/images/cyclecrossing.jpg", text: "CYCLE CROSSING - Cyclists may be crossing the road ahead. Slow down and give way when necessary." },
  { image: "/images/menatwork.png", text: "MEN AT WORK - Roadwork ahead. Drive cautiously and be prepared for possible detours or obstructions." },
  { image: "/images/rightreversebend.jpg", text: "RIGHT REVERSE BEND - The road curves sharply to the right and then to the left. Reduce speed and procee." },
  { image: "/images/oneway.jpg", text: "ONE WAY - Do not enter. Traffic flows only in the opposite direction." },
  { image: "/images/seatbelt.jpg", text: "SEATBELT - Buckle up for safety. It’s the law and protects lives." },

  { image: "/images/rightpinbend.jpg", text: "RIGHT PIN BEND - Sharp right turn ahead. Reduce speed and navigate carefully." },
  { image: "/images/leftpinbend.jpg", text: "LEFT PIN BEND - Sharp left turn ahead. Reduce speed and navigate carefully." },
  { image: "/images/allvehiclesprohibited.jpg", text: "ALL VEHICLES PROHIBITED - No entry for any type of vehicle beyond this point." },
  { image: "/images/roundabout.jpg", text: "ROUNDABOUT AHEAD - Reduce speed and keep moving in a circular direction." },
  { image: "/images/narrowbridge.jpg", text: "NARROW BRIDGE AHEAD - Slow down and proceed with caution." },
];

const TrafficRules = () => {
  return (
    <div className="main-section1">
        <div className="heading">
            <h1 className="page-heading">Know the Rules,</h1>
            <h1 className="page-heading">Drive with Confidence!</h1>
        </div>
      <div className="main-section">
      {/* Render first row */}
      <div className="main-row">
        {trafficSigns.slice(0, 5).map((sign, index) => (
          <SignCard key={index} image={sign.image} text={sign.text} />
        ))}
      </div>

      {/* Render second row */}
      <div className="main-row">
        {trafficSigns.slice(5).map((sign, index) => (
          <SignCard key={index + 5} image={sign.image} text={sign.text} />
        ))}
      </div>
      </div>
    </div>
  );
};

export default TrafficRules;
