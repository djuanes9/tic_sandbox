"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import mqtt from "mqtt";

const OnStyle = { color: "red" };
const OffStyle = { color: "green" };
//Variables Proceso
let statusValv;
const statusConv1 = { color: "" };
const statusConv2 = { color: "" };

const MQTTClient = () => {
  const [isConnected, setIsConnected] = useState(false);

  // Estados para almacenar el estado de los tópicos
  const [statuses, setStatuses] = useState<{
    "SILO-101": number;
    "CNVR-101": string;
    "MILL-101": string;
    "CNVR-102": string;
    NIVEL: string;
  }>({
    "SILO-101": 0,
    "CNVR-101": "OFF",
    "MILL-101": "OFF",
    "CNVR-102": "OFF",
    NIVEL: "OFF",
  });

  // Cliente MQTT
  useEffect(() => {
    const mqttClient = mqtt.connect(
      "wss://260739b4dbf540efbb87cd6f024aa9f0.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: "djuanes9", // Reemplaza con tu nombre de usuario
        password: "Jeagdrose1125", // Reemplaza con tu contraseña
      }
    );

    mqttClient.on("connect", () => {
      console.log("Conectado al broker MQTT");
      setIsConnected(true);

      mqttClient.subscribe(
        ["SILO-101", "CNVR-101", "MILL-101", "CNVR-102", "NIVEL"],
        (err) => {
          if (err) {
            console.error("Error de suscripción: ", err);
          } else {
            console.log("Suscrito a los tópicos.");
          }
        }
      );
    });

    mqttClient.on("message", (topic: string, message: any) => {
      const msg = message.toString();
      console.log(`Mensaje recibido de ${topic}: ${msg}`);

      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [topic as keyof typeof statuses]:
          topic === "SILO-101" ? Number(msg) : msg === "true" ? "ON" : "OFF",
      }));
    });

    mqttClient.on("error", (err) => {
      console.error("Error en MQTT: ", err);
    });

    return () => {
      mqttClient.end(); // Cerrar la conexión cuando el componente se desmonte
    };
  }, []);

  // Función para enviar mensajes a los tópicos
  const sendMessage = (topic: string, message: string) => {
    const mqttClient = mqtt.connect(
      "wss://260739b4dbf540efbb87cd6f024aa9f0.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: "djuanes9", // Reemplaza con tu nombre de usuario
        password: "Jeagdrose1125", // Reemplaza con tu contraseña
      }
    );

    mqttClient.publish(topic, message, {}, (err) => {
      if (err) {
        console.error(`Error al publicar en el tópico ${topic}: `, err);
      } else {
        console.log(`Mensaje enviado a ${topic}: ${message}`);
      }
    });
  };

  if (statuses["CNVR-101"] === "ON") {
    statusConv1.color = "red";
  } else {
    statusConv1.color = "green";
  }

  if (statuses["CNVR-102"] === "ON") {
    statusConv2.color = "red";
  } else {
    statusConv2.color = "green";
  }

  // ReactDOM.render(
  //  <h1 className="heading" contentEditable="false" spellCheck="false">
  //    Subproceso 2: Molienda de Granos
  //  </h1>,
  //  document.getElementById("root")
  // );

  return (
    <div>
      <p>Status de conexión: {isConnected ? "Conectado" : "Desconectado"}</p>

      <div>
        <div>
          <h3>SILO-101</h3>
          <p className="text-black">Nivel: {statuses["SILO-101"]}%</p>
        </div>
        <div>
          <h3>CNVR-101</h3>
          <p style={statusConv1}>Estado: {statuses["CNVR-101"]}</p>
        </div>
        <div>
          <h3>MILL-101</h3>
          <p
            className={
              statuses["MILL-101"] === "ON" ? "text-red-500" : "text-green-500"
            }
          >
            Estado: {statuses["MILL-101"]}
          </p>
        </div>
        <div>
          <h3> CNVR-102</h3>
          <p style={statusConv2}>Estado: {statuses["CNVR-102"]}</p>
        </div>
        <div>
          <h3>NIVEL</h3>
          <p
            className={
              statuses["NIVEL"] === "ON" ? "text-red-500" : "text-green-500"
            }
          >
            Estado: {statuses["NIVEL"]}
          </p>
        </div>
      </div>

      {/* Botones de Start y Stop */}
      <div>
        <button
          onClick={() => sendMessage("start", "true")}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          START
        </button>
        <button
          onClick={() => sendMessage("stop", "true")}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Stop
        </button>
        <p>
          <a href="./Charts.tsx">MySQL</a>
        </p>
      </div>
    </div>
  );
};

export default MQTTClient;
