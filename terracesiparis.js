// 1. GÜVENLİK VE KİMLİK TANIMA (Redmi 14C)
const isTulayAdmin = navigator.userAgent.includes("2409BRN2C") || navigator.userAgent.includes("Redmi 14C");
let secilenBlok = "", secilenDaire = "", secilenUrun = "";

// 2. BİLDİRİM İZNİ OTOMATİĞİ
function izinIste() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

// 3. GÜNLÜK 7 HAK SINIRI (Admin Değilse Çalışır)
function hakKontrol() {
    if (isTulayAdmin) return true;
    let data = JSON.parse(localStorage.getItem('tp_hak')) || { gun: new Date().toDateString(), adet: 0 };
    if (data.gun !== new Date().toDateString()) data = { gun: new Date().toDateString(), adet: 0 };
    return data.adet < 7;
}

// 4. DAİREYE TIKLAYINCA PANELİ AÇAN BEYİN
function secimAc(blok, daire) {
    if (!hakKontrol()) { 
        alert("Günlük 7 sipariş hakkınız dolmuştur!"); 
        return; 
    }
    secilenBlok = blok; 
    secilenDaire = daire;
    document.getElementById('secim-baslik').innerText = blok + daire + " - HANGİSİNİ SEÇ?";
    document.getElementById('modal').style.display = 'flex';
    izinIste(); // Her tıklamada izni kontrol et
}

// 5. ÜRÜN SEÇİMİ (SU/EKMEK)
function urunSec(urun, btn) {
    secilenUrun = urun;
    document.querySelectorAll('.urun-btn').forEach(b => b.style.borderColor = '#444');
    btn.style.borderColor = '#ffcc00';
}

// 6. TAMAM DEYİNCE BİLDİRİMİ GÖNDEREN MOTOR
function tamamDe() {
    if (!secilenUrun) { 
        alert("Lütfen Su veya Ekmek seçin!"); 
        return; 
    }
    
    if (Notification.permission === "granted") {
        const options = {
            body: `${secilenBlok} Blok Daire ${secilenDaire}: ${secilenUrun.toUpperCase()} İSTİYOR!`,
            icon: "https://cdn-icons-png.flaticon.com/512/3502/3502214.png",
            vibrate: [500, 110, 500], // Telefonun titremesini sağlar
            requireInteraction: true  // Bildirim ekranda asılı kalır
        };

        new Notification("TERRACE PARK SİPARİŞ", options);
    } else {
        alert("BİLDİRİM İZNİ YOK! Lütfen tarayıcıdan izin verin.");
    }

    // Hak düşürme (Tülay değilse)
    if (!isTulayAdmin) {
        let data = JSON.parse(localStorage.getItem('tp_hak')) || { gun: new Date().toDateString(), adet: 0 };
        data.adet++;
        localStorage.setItem('tp_hak', JSON.stringify(data));
    }

    // Paneli kapat ve temizle
    document.getElementById('modal').style.display = 'none';
    secilenUrun = "";
}

// 7. 318 DAİREYİ EKRANA DİZİCİ (A-D 46, E-F 67)
document.addEventListener('DOMContentLoaded', () => {
    izinIste();
    const anaListe = document.getElementById('ana-liste');
    const blokYapisi = [
        {ad:'A', adet:46}, {ad:'B', adet:46}, {ad:'C', adet:46}, 
        {ad:'D', adet:46}, {ad:'E', adet:67}, {ad:'F', adet:67}
    ];

    blokYapisi.forEach(blok => {
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
