/* 1. GÜVENLİK VE KİMLİK (Redmi 14C Kontrolü) */
const isTulayAdmin = navigator.userAgent.includes("2409BRN2C") || navigator.userAgent.includes("Redmi 14C");
let secilenBlok = "", secilenDaire = "", secilenUrun = "";

/* 2. BİLDİRİM İZNİ OTOMATİĞİ */
function izinIste() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

/* 3. GÜNLÜK 7 HAK SINIRI */
function hakKontrol() {
    if (isTulayAdmin) return true; // Tülay için sınırsız
    let data = JSON.parse(localStorage.getItem('tp_hak')) || { gun: new Date().toDateString(), adet: 0 };
    if (data.gun !== new Date().toDateString()) data = { gun: new Date().toDateString(), adet: 0 };
    return data.adet < 7;
}

/* 4. SEÇİM PANELİNİ AÇMA */
function secimAc(blok, daire) {
    if (!hakKontrol()) { alert("Günlük 7 hakkınız dolmuştur!"); return; }
    secilenBlok = blok; 
    secilenDaire = daire;
    document.getElementById('secim-baslik').innerText = blok + daire + " - SEÇİM YAP";
    document.getElementById('modal').style.display = 'flex';
    izinIste();
}

/* 5. ÜRÜN SEÇİMİ (SU/EKMEK) */
function urunSec(urun, btn) {
    secilenUrun = urun;
    document.querySelectorAll('.urun-btn').forEach(b => b.style.borderColor = '#444');
    btn.style.borderColor = '#ffcc00';
}

/* 6. TAMAM DEYİNCE BİLDİRİM GÖNDERME */
function tamamDe() {
    if (!secilenUrun) { alert("Lütfen ürün seçin!"); return; }
    
    if (Notification.permission === "granted") {
        const options = {
            body: secilenBlok + " Blok Daire " + secilenDaire + ": " + secilenUrun.toUpperCase() + " İSTİYOR!",
            icon: "https://cdn-icons-png.flaticon.com/512/3502/3502214.png",
            vibrate: [500, 110, 500],
            requireInteraction: true 
        };
        new Notification("TERRACE PARK SİPARİŞ", options);
    } else {
        alert("BİLDİRİM İZNİ YOK! Lütfen tarayıcıdan izin verin.");
    }

    if (!isTulayAdmin) {
        let data = JSON.parse(localStorage.getItem('tp_hak')) || { gun: new Date().toDateString(), adet: 0 };
        data.adet++;
        localStorage.setItem('tp_hak', JSON.stringify(data));
    }

    document.getElementById('modal').style.display = 'none';
    secilenUrun = "";
}

/* 7. 318 DAİREYİ DİZİCİ MOTOR */
document.addEventListener('DOMContentLoaded', () => {
    const anaListe = document.getElementById('ana-liste');
    const bloklar = [
        {ad:'A', adet:46}, {ad:'B', adet:46}, {ad:'C', adet:46}, 
        {ad:'D', adet:46}, {ad:'E', adet:67}, {ad:'F', adet:67}
    ];

    bloklar.forEach(blok => {
        const blokKutusu = document.createElement('div');
        blokKutusu.className = 'blok-konteyner';
        blokKutusu.innerHTML = '<h2>' + blok.ad + '</h2>';
        for (let i = 1; i <= blok.adet; i++) {
            const btn = document.createElement('button');
            btn.className = 'daire-btn';
            btn.innerText = blok.ad + i;
            btn.onclick = function() { secimAc(blok.ad, i); };
            blokKutusu.appendChild(btn);
        }
        anaListe.appendChild(blokKutusu);
    });
});
