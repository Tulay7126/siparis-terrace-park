// REDMİ 14C VE ADMİN AYARI
const isTulayAdmin = navigator.userAgent.includes("Redmi 14C");
let secilenBlok = "", secilenDaire = "", secilenUrun = "";

// BİLDİRİM İZNİ OTOMATİĞİ
function izinIste() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

// GÜNLÜK 7 HAK SINIRI
function hakKontrol() {
    if (isTulayAdmin) return true;
    let data = JSON.parse(localStorage.getItem('tp_hak')) || { gun: new Date().toDateString(), adet: 0 };
    if (data.gun !== new Date().toDateString()) data = { gun: new Date().toDateString(), adet: 0 };
    return data.adet < 7;
}

function secimAc(blok, daire) {
    if (!hakKontrol()) { alert("Günlük 7 hakkınız doldu!"); return; }
    secilenBlok = blok; secilenDaire = daire;
    document.getElementById('secim-baslik').innerText = blok + daire + " - SEÇİM YAP";
    document.getElementById('modal').style.display = 'flex';
    izinIste();
}

function urunSec(urun, btn) {
    secilenUrun = urun;
    document.querySelectorAll('.urun-btn').forEach(b => b.style.borderColor = '#444');
    btn.style.borderColor = '#ffcc00';
}

function tamamDe() {
    if (!secilenUrun) { alert("Lütfen ürün seçin!"); return; }
    
    // BİLDİRİMİ GÖNDER
    if (Notification.permission === "granted") {
        new Notification("TERRACE PARK", {
            body: secilenBlok + " Blok Daire " + secilenDaire + ": " + secilenUrun.toUpperCase() + "!",
            icon: "https://cdn-icons-png.flaticon.com/512/3502/3502214.png"
        });
    }

    if (!isTulayAdmin) {
        let data = JSON.parse(localStorage.getItem('tp_hak')) || { gun: new Date().toDateString(), adet: 0 };
        data.adet++;
        localStorage.setItem('tp_hak', JSON.stringify(data));
    }

    document.getElementById('modal').style.display = 'none';
    secilenUrun = "";
}

// DAİRELERİ OTOMATİK DİZ
document.addEventListener('DOMContentLoaded', () => {
    const anaListe = document.getElementById('ana-liste');
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(ad => {
        const adet = (ad === 'E' || ad === 'F') ? 67 : 46;
        const blokKutusu = document.createElement('div');
        blokKutusu.className = 'blok-konteyner';
        blokKutusu.innerHTML = '<h2>' + ad + '</h2>';
        for (let i = 1; i <= adet; i++) {
            const btn = document.createElement('button');
            btn.className = 'daire-btn';
            btn.innerText = ad + i;
            btn.onclick = function() { secimAc(ad, i); };
            blokKutusu.appendChild(btn);
        }
        anaListe.appendChild(blokKutusu);
    });
});
