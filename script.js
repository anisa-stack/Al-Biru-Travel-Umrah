/* ============================================================
   BAITUL HAQ TRAVEL — Script Utama
   Fungsi: Navigasi halaman, animasi, partikel, statistik, filter
   ============================================================ */

// ============================================================
// 1. PARTIKEL LATAR BELAKANG — Membuat elemen partikel mengapung
// ============================================================
function buatPartikel() {
    const wadahPartikel = document.getElementById('partikel-latar');
    const jumlahPartikel = 30; // Jumlah partikel yang ditampilkan

    for (let i = 0; i < jumlahPartikel; i++) {
        const partikel = document.createElement('div');
        partikel.classList.add('partikel');

        // Ukuran acak antara 40px hingga 160px
        const ukuran = Math.random() * 120 + 40;
        partikel.style.width = ukuran + 'px';
        partikel.style.height = ukuran + 'px';

        // Posisi horizontal acak
        partikel.style.left = Math.random() * 100 + 'vw';

        // Durasi animasi acak antara 12 hingga 28 detik
        const durasi = Math.random() * 16 + 12;
        partikel.style.animationDuration = durasi + 's';

        // Jeda mulai acak agar tidak bersamaan
        const jeda = Math.random() * 15;
        partikel.style.animationDelay = '-' + jeda + 's';

        wadahPartikel.appendChild(partikel);
    }
}

// ============================================================
// 2. NAVIGASI HALAMAN — Perpindahan antar halaman tanpa refresh
// ============================================================
function navigasiKe(idHalaman, tambahHistory = true) {

    const semua = document.querySelectorAll('.halaman');
    semua.forEach(h => h.classList.add('tersembunyi'));

    const halamaTujuan = document.getElementById('halaman-' + idHalaman);
    if (halamaTujuan) {
        halamaTujuan.classList.remove('tersembunyi');
    }

    if (tambahHistory) {
        history.pushState({ halaman: idHalaman }, '', '#' + idHalaman);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    tutupMenuMobile();
}

window.addEventListener('popstate', function(e) {
    if (e.state && e.state.halaman) {
        navigasiKe(e.state.halaman, false);
    }
});

let startX = 0;

window.addEventListener('touchstart', e=>{
    startX = e.changedTouches[0].screenX;
});

window.addEventListener('touchend', e=>{
    let endX = e.changedTouches[0].screenX;

    if(endX - startX > 80){
        history.back();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    buatPartikel();

    const hash = location.hash.replace('#','') || 'home';
    navigasiKe(hash, false);
});

// 3. MENU DESKTOP — Tangkap klik pada tautan menu
document.querySelectorAll('.tautan-menu').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const halaman = this.dataset.halaman;
        navigasiKe(halaman);
    });
});

// 4. MENU MOBILE — Buka dan tutup overlay navigasi mobile
const tomatanHamburger = document.getElementById('tombol-hamburger');
const overlayMobile = document.getElementById('menu-mobile-overlay');
const tomatanTutup = document.getElementById('tombol-tutup-mobile');

// Buka menu mobile
tomatanHamburger.addEventListener('click', function() {
    overlayMobile.classList.add('terbuka');
});

// Tutup menu mobile dari tombol X
tomatanTutup.addEventListener('click', function() {
    tutupMenuMobile();
});

// Tutup menu mobile dari luar area menu
overlayMobile.addEventListener('click', function(e) {
    if (e.target === overlayMobile) {
        tutupMenuMobile();
    }
});

// Tangkap klik pada tautan menu mobile
document.querySelectorAll('.tautan-menu-mobile').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const halaman = this.dataset.halaman;
        navigasiKe(halaman);
    });
});

// Fungsi helper untuk menutup menu mobile
function tutupMenuMobile() {
    overlayMobile.classList.remove('terbuka');
}

// 5. NAVBAR SCROLL EFFECT — Ubah tampilan navbar saat scrool
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navigasi-utama');
    if (window.scrollY > 60) {
        navbar.classList.add('aktif-scroll');
    } else {
        navbar.classList.remove('aktif-scroll');
    }
});

// 6. TOMBOL KEMBALI KE ATAS — Tampil/sembunyikan berdasarkan scroll
const tomatanKeAtas = document.getElementById('tombol-ke-atas');

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        tomatanKeAtas.classList.add('terlihat');
    } else {
        tomatanKeAtas.classList.remove('terlihat');
    }
});

tomatanKeAtas.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 7. ANIMASI STATISTIK — Hitung angka secara bertahap
function animasiStatistik() {
    const item = document.querySelectorAll('.stat-item');
    item.forEach(function(el) {
        const angka = parseInt(el.dataset.angka);
        const suffix = el.dataset.suffix;
        const elemen = el.querySelector('.stat-angka');
        const durasi = 1800; // Durasi animasi dalam milidetik
        const langkah = 16;  // Interval setiap frame
        let mulai = null;

        function update(timestamp) {
            if (!mulai) mulai = timestamp;
            const kemajuan = Math.min((timestamp - mulai) / durasi, 1);
            // Fungsi easing (ease-out cubic)
            const easing = 1 - Math.pow(1 - kemajuan, 3);
            const nilai = Math.floor(easing * angka);
            elemen.textContent = nilai + suffix;

            if (kemajuan < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    });
}

// 8. INTERSECTION OBSERVER — Trigger animasi saat terlihat layar
const pengamatan = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            // Jalankan animasi statistik
            if (entry.target.classList.contains('bagian-statistik')) {
                animasiStatistik();
                pengamatan.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.5 });

// Amati bagian statistik
const bagianStatistik = document.querySelector('.bagian-statistik');
if (bagianStatistik) {
    pengamatan.observe(bagianStatistik);
}

// 9. FILTER DOKUMENTASI — Tampil/sembunyikan berdasarkan kategori
const tombolFilter = document.querySelectorAll('.tombol-filter');

tombolFilter.forEach(function(tombol) {
    tombol.addEventListener('click', function() {
        // Perbarui status aktif tombol filter
        tombolFilter.forEach(t => t.classList.remove('aktif'));
        this.classList.add('aktif');

        const kategori = this.dataset.filter;
        const kartFoto = document.querySelectorAll('.kartu-foto');

        kartFoto.forEach(function(kartu) {
            if (kategori === 'semua' || kartu.dataset.kategori === kategori) {
                // Tampilkan kartu dengan animasi bertahap
                kartu.classList.remove('tersembunyi');
                kartu.style.animation = 'munculHalaman 0.4s ease forwards';
            } else {
                // Sembunyikan kartu yang tidak sesuai filter
                kartu.classList.add('tersembunyi');
            }
        });
    });
});

// 10. INISIALISASI — Jalankan semua fungsi saat halaman siap
document.addEventListener('DOMContentLoaded', function() {
    buatPartikel();          // Buat efek partikel latar belakang
    navigasiKe('home');      // Mulai di halaman Home
});