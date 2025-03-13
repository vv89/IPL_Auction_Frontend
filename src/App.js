import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
    const [teams, setTeams] = useState([]);
    const [bids, setBids] = useState({});

    useEffect(() => {
        axios.get("http://localhost:5000/teams").then(res => setTeams(res.data));
        socket.on("updateBid", updatedTeam => {
            setTeams(prev => prev.map(t => (t.id === updatedTeam.id ? updatedTeam : t)));
        });
    }, []);

    const placeBid = (teamId) => {
        const bidAmount = bids[teamId] || 0;
        if (bidAmount > 0) {
            socket.emit("placeBid", { teamId, bidAmount, owner: "User A" });
        }
    };

    return (
        <div style={{ textAlign: "center", fontFamily: "Arial" }}>
            <h1>🏏 IPL Team Auction (Max 5000 Points)</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", padding: "20px" }}>
                {teams.map(team => (
                    <div key={team.id} style={{ border: "2px solid black", padding: "20px", borderRadius: "10px" }}>
                        <h2>{team.name}</h2>
                        <p><strong>Max Points:</strong> 5000</p>
                        <p><strong>Current Bid:</strong> {team.highestBid} <br /> <small>Owner: {team.owner || "No Owner Yet"}</small></p>
                        <input 
                            type="number" 
                            min="1" 
                            max="5000" 
                            value={bids[team.id] || ""} 
                            onChange={(e) => setBids({ ...bids, [team.id]: Number(e.target.value) })}
                            placeholder="Enter bid" 
                        />
                        <button onClick={() => placeBid(team.id)} style={{ padding: "10px", fontSize: "16px", marginLeft: "10px", cursor: "pointer" }}>
                            Place Bid
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
