// 1. HAFIZA VE AYARLAR
let secilenBlok = "";
let secilenDaire = "";
let secilenUrun = "";

// 2. BİLDİRİM İZNİ İSTE (SİTE AÇILINCA)
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// 3. ARKA PLAN DEĞİŞTİRME
function bgDegis(renk) {
    document.body.style.backgroundColor = renk;
}

// 4. ADIMLARI YÖNETEN FONKSİYON
function adimGeri(adim) {
    document.getElementById('adim1').classList.add('gizli');
    document.getElementById('adim2').classList.add('gizli');
    document.getElementById('adim3').classList.add('gizli');
    document.getElementById('adim' + adim).classList.remove('gizli');
}

// 5. BLOK SEÇME İŞLEMİ
function blokSec(ad, adet) {
    secilenBlok = ad;
    document.getElementById('blok-baslik').innerText = ad + " Blok - Daire Seç";
    const dKutusu = document.getElementById('daire-butonlar');
    dKutusu.innerHTML = ""; 

    for (let i = 1; i <= adet; i++) {
        const btn = document.createElement('button');
        btn.className = 'daire-btn';
        btn.innerText = i;
        btn.onclick = () => daireSec(i);
        dKutusu.appendChild(btn);
    }
    adimGeri(2);
}

// 6. DAİRE SEÇME İŞLEMİ
function daireSec(no) {
    secilenDaire = no;
    document.getElementById('daire-baslik').innerText = secilenBlok + " Blok Daire " + no;
    secilenUrun = "";
    document.getElementById('ozet').innerText = "";
    document.getElementById('onay-btn').classList.add('gizli');
    adimGeri(3);
}

// 7. ÜRÜN SEÇME (💧/🍞)
function urunSec(urun) {
    secilenUrun = urun;
    document.getElementById('ozet').innerText = "Seçilen: " + urun;
    document.getElementById('onay-btn').classList.remove('gizli');
}

// 8. TAMAM DEYİNCE ÇALIŞACAK GARANTİ FONKSİYON
function siparisTamamla() {
    const mesaj = secilenBlok + " " + secilenDaire + " - " + secilenUrun.toUpperCase();
    
    // Önce bildirim göndermeyi dene
    if (Notification.permission === "granted") {
        try {
            new Notification("Terrace Park", {
                body: mesaj + " siparişi iletildi!",
                icon: "https://cdn-icons-png.flaticon.com/512/3502/3502214.png"
            });
        } catch (e) {
            console.log("Bildirim gönderilemedi, alert devrede.");
        }
    }
    
    // REDMI 14C İÇİN GARANTİ: Ekrana mutlaka bu uyarıyı çıkar
    alert("SİPARİŞ TAMAM: " + mesaj);
    
    // Her şeyi başa sar ve temizle
    adimGeri(1);
    secilenUrun = "";
    document.getElementById('onay-btn').classList.add('gizli');
    document.getElementById('ozet').innerText = "";
}

// 9. BAŞLANGIÇTA BLOKLARI DİZ (A-D 46, E-F 67)
document.addEventListener('DOMContentLoaded', () => {
    const bloklar = [
        { ad: 'A', adet: 46 }, { ad: 'B', adet: 46 },
        { ad: 'C', adet: 46 }, { ad: 'D', adet: 46 },
        { ad: 'E', adet: 67 }, { ad: 'F', adet: 67 }
    ];

    const bKutusu = document.getElementById('blok-butonlar');
    bloklar.forEach(b => {
        const btn = document.createElement('button');
        btn.className = 'blok-btn';
        btn.style.width = "80%"; 
        btn.innerText = b.ad + " BLOK";
        btn.onclick = () => blokSec(b.ad, b.adet);
        bKutusu.appendChild(btn);
    });
});
