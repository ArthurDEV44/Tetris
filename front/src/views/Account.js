import { Link, useNavigate } from "react-router-dom";
import RequireAuth from "../lib/auth";
import { getTokenFromLocalStorage } from "../lib/common";
import { useEffect, useState } from "react";
import axios from "axios";

const Account = () => {
  RequireAuth();
  const navigate = useNavigate();
  const token = getTokenFromLocalStorage();
  const [user, setUser] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    accountInfo();
  }, []);

  const accountInfo = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "http://localhost:8180/userinfo",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        setUser(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const Random = async (e) => {
    e.preventDefault();
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:8180/create-room",
        data: {
          id: user.id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        console.log(response);
        const roomToken = response.data.token; // Récupéreration du token de la room crée
        console.log("Token de la Room:", roomToken);
        navigate("/tetris");
      }
    } catch (err) {
      setErrorMessage(err.response.data.message);
    }
  };

  const Room = () => {
    navigate("/Room", { state: { id: user.id } });
  };

  return (
    <section className="account">
      <h2>Votre compte</h2>
      <div className="user">
        <div className="accountData">
          <article>
            <h3 className="titleAccount">Information Utilisateur</h3>
            <button className="custom-btn btn btn-black">
              Modifier mes données
            </button>
          </article>
          <article>
            <h3>Partie Solo</h3>
            <Link to="/Tetris">
              <button className="custom-btn btn btn-black">Partie Solo</button>
            </Link>
          </article>
          <article>
            <h3>Multi-Joueur</h3>
            <button onClick={Random} className="custom-btn btn btn-black space">
              Aléatoire
            </button>
            <button onClick={Room} className="custom-btn btn btn-black space">
              Room
            </button>
          </article>
          <article>
            <Link to="/logout">
              <button className="custom-btn btn btn-black">Deconnexion</button>
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Account;
