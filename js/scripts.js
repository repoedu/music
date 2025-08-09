"use strict";

const songs = [
    // { id: "1", artist: "Hombres G", title: "Si no te tengo a ti", src: "audio/Hombres G - Si no te tengo a ti.m4a" },
    { id: "2", artist: "Arena Hash", title: "Como te va mi amor", src: "audio/Arena Hash - Como te va mi amor.m4a" },
    { id: "3", artist: "Virus", title: "Polvos de una relacion", src: "audio/Virus - Polvos de una relacion.m4a" },
    { id: "4", artist: "Pedro Suarez Vertiz", title: "Te siento de solo pensar", src: "audio/Pedro Suarez Vertiz - Te siento de solo pensar.m4a" },
    { id: "5", artist: "Virus", title: "Sin disfraz", src: "audio/Virus - Sin disfraz.m4a" },
    { id: "6", artist: "Danza Invisible", title: "Sin aliento", src: "audio/Danza Invisible - Sin aliento.m4a" },
    // { id: "7", artist: "Miguel Mateos", title: "Perdiendo el control", src: "audio/Miguel Mateos - Perdiendo el control.m4a" },
    // { id: "8", artist: "Ciro y Los Persas", title: "Insisto", src: "audio/Ciro y Los Persas - Insisto.m4a" },
    // { id: "9", artist: "Los Hermanos Moreno", title: "Por alguien como tu", src: "audio/Los Hermanos Moreno - Por alguien como tu.m4a" },
    // { id: "10", artist: "Miguel Mateos", title: "Atado a un sentimiento", src: "audio/Miguel Mateos - Atado a un sentimiento.m4a" },
];

// Ordenamos el listado de canciones por artista
songs.sort((a, b) => a.artist > b.artist ? 1 : a.artist < b.artist ? -1 : 0);

const totalSongs = songs.length;
const audio = document.querySelector("audio");
const title = document.querySelector(".title");
const nextTrackBtn = document.querySelector(".nextTrackBtn");
const loopTrackBtn = document.querySelector(".loopTrackBtn");
const previousTrackBtn = document.querySelector(".previousTrackBtn");
const songList = document.querySelector(".song-list");

let currentSongIndex = 0;
let isLoop = false;

const displaySongs = () => {
    // let listItem; Esta instruccion generaba un BUG
    const fragment = document.createDocumentFragment();
    songs.forEach((song, idx) => {

        const listItem = document.createElement("li");
        listItem.textContent = (idx + 1) + ". " + song.src.slice(song.src.lastIndexOf("/") + 1);
        listItem.dataset.idx = idx; // Guardamos el índice

        if (idx === currentSongIndex) {
            listItem.classList.add("active");
        }

        listItem.onclick = () => {
            const previous = document.querySelector("li.active");
            if (previous) previous.classList.remove("active");

            listItem.classList.add("active");

            currentSongIndex = idx;
            loadSong(songs[currentSongIndex]);
            audio.play();
        }
        fragment.appendChild(listItem);
    });
    songList.appendChild(fragment);
}

const checkActive = (idx) => {
    const previous = document.querySelector("li.active");
    if (previous) previous.classList.remove("active");
    const current = songList.querySelector(`li[data-idx='${idx}']`);

    if (current) {
        current.classList.add("active");
        current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

const loadSong = (song) => {
    audio.src = song.src;
    title.textContent = "🎵 " + song.title + " - " + song.artist + " 🎵";
}

audio.addEventListener("ended", () => {
    if (currentSongIndex < totalSongs - 1) {
        currentSongIndex += 1;
        loadSong(songs[currentSongIndex]); // Cargamos el siguiente audio
        audio.play(); // Reproducimos el audio
    } else {
        currentSongIndex = 0;
        loadSong(songs[currentSongIndex]);
    }

    checkActive(currentSongIndex);
});

previousTrackBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex - 1 + totalSongs) % totalSongs;
    if (!audio.paused) { // Si el audio previo se esta reproduciendo
        loadSong(songs[currentSongIndex]); // Cargamos el siguiente audio
        audio.play(); // Reproducimos el audio
    } else {
        loadSong(songs[currentSongIndex]);
    }

    checkActive(currentSongIndex);
});

nextTrackBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % totalSongs;
    if (!audio.paused) {
        loadSong(songs[currentSongIndex]);
        audio.play();
    } else {
        loadSong(songs[currentSongIndex]);
    }

    checkActive(currentSongIndex);
});

loopTrackBtn.addEventListener("click", () => {
    isLoop = !isLoop;
    audio.loop = isLoop;
    loopTrackBtn.textContent = isLoop ? "🔂" : "🔁";
});

displaySongs();
loadSong(songs[currentSongIndex]);

