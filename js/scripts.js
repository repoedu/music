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
const sortedSongs = songs
    .map((song, idx) => ({ ...song, idx }))
    .sort((a, b) => a.artist.localeCompare(b.artist));

const recentlyPlayed = [];

console.log(sortedSongs);
const totalSongs = songs.length;
let currentSongIndex = 0; // El primer objeto del array de canciones despues de ser ordenado por artista
let isRepeat = false;
let isRandom = false;

const audio = document.querySelector("audio");

const songList = document.querySelector(".song-list");
const songTitle = document.querySelector(".song-title");
const prevBtn = document.querySelector(".prevBtn");
const nextBtn = document.querySelector(".nextBtn");
const repeatBtn = document.querySelector(".repeatBtn");
const randomBtn = document.querySelector(".randomBtn");

const displaySongList = async () => {

    const fragment = document.createDocumentFragment();
    sortedSongs.forEach((obj, idx) => {
        const li = document.createElement("li");
        li.textContent = (idx + 1) + ". " + obj.src.slice(obj.src.lastIndexOf("/") + 1);
        li.dataset.idx = idx; // Guardamos el índice

        // Si es la canción que está sonando, resaltarla
        if (idx === currentSongIndex) {
            li.classList.add("playing");
        }

        li.onclick = () => {
            const previous = document.querySelector("li.playing");
            if (previous) previous.classList.remove("playing");

            li.classList.add("playing");

            currentSongIndex = idx;
            loadSong(currentSongIndex);
            audio.play();
        };

        fragment.appendChild(li);
    });
    songList.appendChild(fragment);
};

const loadSong = (index) => {
    audio.src = sortedSongs[index].src;
    songTitle.textContent = "🎵 " + sortedSongs[index].artist + " - " + sortedSongs[index].title + " 🎵";
};

const shuffle = (songs) => {
    const n = songs.length;
    for (let i = 0; i < n; i++) {
        const r = i + Math.floor(Math.random() * (n - i));
        [songs[i], songs[r]] = [songs[r], songs[i]]; // Intercambia los elementos
    }
}

const checkPlaying = (index) => {
    const previous = document.querySelector("li.playing");
    if (previous) previous.classList.remove("playing");
    const current = document.querySelector(`.song-list li[data-idx='${index}']`);

    if (current) {
        current.classList.add("playing");
        current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

audio.addEventListener("ended", () => {

    if (isRepeat) {
        audio.play();
    } else {

        currentSongIndex = currentSongIndex + 1;
        checkPlaying(currentSongIndex);

        if (currentSongIndex < totalSongs) {
            loadSong(currentSongIndex);
            audio.play();
        } else {
            currentSongIndex = 0;
            checkPlaying(currentSongIndex);
            loadSong(currentSongIndex);
        }
    }
});

nextBtn.addEventListener("click", function () {

    currentSongIndex = (currentSongIndex + 1) % totalSongs;

    checkPlaying(currentSongIndex);

    if (!audio.paused) {
        loadSong(currentSongIndex);
        audio.play();
    } else {
        loadSong(currentSongIndex);
    }
});

prevBtn.addEventListener("click", function () {
    currentSongIndex = (currentSongIndex - 1 + totalSongs) % totalSongs;

    checkPlaying(currentSongIndex);

    if (!audio.paused) {
        loadSong(currentSongIndex);
        audio.play();
    } else {
        loadSong(currentSongIndex);
    }
});

repeatBtn.addEventListener("click", function () {
    isRepeat = !isRepeat;
    repeatBtn.querySelector(".icon").classList.toggle("active");
    audio.loop = isRepeat;
    // if (isRepeat) {
    //     audio.currentTime = 0;
    //     audio.play();
    // }
});

/**
 * Al hacer click en el random la cancion que se encuentra sonando no debe detenerse
*/
randomBtn.addEventListener("click", function () {
    isRandom = !isRandom;
    randomBtn.querySelector(".icon").classList.toggle("active");
    if (isRandom) {
        console.log(currentSongIndex);
        shuffle(sortedSongs);
        // currentSongIndex = 0;
        // loadSong(currentSongIndex);
        //console.log(sortedSongs);
    } else {
        console.log("Se desactivo el random continuar en el indice del listado orignal a la ultima cancion.");
    }
});

loadSong(currentSongIndex); // Carga la primera cancion en el índice 0
displaySongList();