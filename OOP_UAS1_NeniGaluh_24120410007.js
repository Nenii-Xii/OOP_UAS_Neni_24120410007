// BAGIAN 1: DEFINISI KELAS-KELAS

// Kelas dasar (Superclass)
class Person {
    constructor(personId, firstName, lastName) {
        this._personId = personId;
        this._firstName = firstName;
        this._lastName = lastName;
    }

    getFullName() {
        return `${this._firstName} ${this._lastName}`;
    }
}

// Kelas turunan Player
class Player extends Person {
    constructor(personId, firstName, lastName, playerNumber, position) {
        super(personId, firstName, lastName);
        this._playerNumber = playerNumber;
        this._position = position;
    }

    playMatch() {
        console.log(`Player ${this.getFullName()} (#${this._playerNumber}) is playing.`);
    }
}

/**
 * Kelas dasar untuk semua individu di dalam klub.
 */
class Person {
    constructor(personId, firstName, lastName, birthDate) {
        this._personId = personId;
        this._firstName = firstName;
        this._lastName = lastName;
        this._birthDate = new Date(birthDate);
    }

    getFullName() {
        return `${this._firstName} ${this._lastName}`;
    }

    getAge() {
        const diff_ms = Date.now() - this._birthDate.getTime();
        const age_dt = new Date(diff_ms);
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }
}

//Kelas Player, turunan dari Person.
class Player extends Person {
    constructor(personId, firstName, lastName, birthDate, playerNumber, position) {
        super(personId, firstName, lastName, birthDate);
        this._playerNumber = playerNumber;
        this._position = position;
    }

    // Method spesifik untuk Player
    playMatch() {
        console.log(`ACTION: ${this.getFullName()} (#${this._playerNumber}) sedang bermain di posisi ${this._position}.`);
    }
}

//Kelas Coach, turunan dari Person.
class Coach extends Person {
    constructor(personId, firstName, lastName, birthDate, coachRole) {
        super(personId, firstName, lastName, birthDate);
        this._coachRole = coachRole; // e.g., Head Coach, Assistant Coach
    }

    // Method spesifik untuk Coach
    conductTraining() {
        console.log(`ACTION: ${this.getFullName()} (${this._coachRole}) sedang memimpin sesi latihan.`);
    }
}

//Kelas Staff, turunan dari Person.
class Staff extends Person {
    constructor(personId, firstName, lastName, birthDate, department, role) {
        super(personId, firstName, lastName, birthDate);
        this._department = department; // e.g., Medical, Administration
        this._role = role;
    }

    // Method spesifik untuk Staff
    performDuty() {
        console.log(`ACTION: ${this.getFullName()} dari departemen ${this._department} sedang menjalankan tugasnya.`);
    }
}

//Kelas Contract, merepresentasikan hubungan kerja antara Klub dan Person.
class Contract {
    constructor(contractId, person, startDate, endDate, salary) {
        this._contractId = contractId;
        this._person = person; // Ini adalah hubungan ke objek Person
        this._startDate = new Date(startDate);
        this._endDate = new Date(endDate);
        this._salary = salary;
    }

    getContractDetails() {
        return `Kontrak ${this._contractId} untuk ${this._person.getFullName()} | Gaji: ${this._salary} | Durasi: ${this._startDate.toLocaleDateString()} - ${this._endDate.toLocaleDateString()}`;
    }
}

//Kelas Team, berisi kumpulan Player dan Coach.
class Team {
    constructor(teamId, name) {
        this._teamId = teamId;
        this._name = name;
        this._players = []; // Hubungan "includes" ke Player
        this._coaches = []; // Hubungan "includes" ke Coach
    }

    addPlayer(player) {
        if (player instanceof Player) {
            this._players.push(player);
        } else {
            console.error("Error: Hanya objek Player yang bisa ditambahkan.");
        }
    }

    addCoach(coach) {
        if (coach instanceof Coach) {
            this._coaches.push(coach);
        } else {
            console.error("Error: Hanya objek Coach yang bisa ditambahkan.");
        }
    }

    listRoster() {
        console.log(`\n--- Skuad Tim: ${this._name} ---`);
        console.log("Pelatih:");
        this._coaches.forEach(c => console.log(`  - ${c.getFullName()} (${c._coachRole})`));
        console.log("Pemain:");
        this._players.forEach(p => console.log(`  - #${p._playerNumber} ${p.getFullName()} (${p._position})`));
        console.log('----------------------------------');
    }
}

//Kelas Club, sebagai entitas utama yang "mempekerjakan" (employs) semua Person dan memiliki (has) Team.
class Club {
    constructor(clubId, name, stadium) {
        this._clubId = clubId;
        this._name = name;
        this._stadium = stadium;
        this._teams = [];
        this._personnel = []; // Semua orang yang dipekerjakan (Player, Coach, Staff)
        this._contracts = []; // Semua kontrak yang aktif
    }
    
    addTeam(team) {
        this._teams.push(team);
    }

    // Method ini mengimplementasikan hubungan "employs" dan "has contract"
    hirePerson(person, contractDetails) {
        if (person instanceof Person) {
            // 1. Tambahkan orang tersebut ke daftar personel klub
            this._personnel.push(person);
            
            // 2. Buat kontrak untuk orang tersebut
            const newContract = new Contract(
                contractDetails.id,
                person, // Menghubungkan kontrak ke objek person
                contractDetails.startDate,
                contractDetails.endDate,
                contractDetails.salary
            );
            this._contracts.push(newContract);
            console.log(`✅ ${person.getFullName()} berhasil direkrut oleh ${this._name}.`);
        } else {
            console.error("Error: Hanya objek turunan Person yang bisa direkrut.");
        }
    }

    displayClubInfo() {
        console.log(`\n================================`);
        console.log(`INFORMASI KLUB: ${this._name}`);
        console.log(`Stadion: ${this._stadium}`);
        console.log(`================================`);
        
        console.log("\n📄 Personel Terdaftar:");
        this._personnel.forEach(p => {
            console.log(`- ${p.getFullName()} (Usia: ${p.getAge()})`);
        });

        console.log("\n📄 Kontrak Aktif:");
        this._contracts.forEach(c => {
            console.log(`- ${c.getContractDetails()}`);
        });
    }
}


// BAGIAN 2: PROGRAM UTAMA (SIMULASI & PENGGUNAAN)

// 1. Memuat objek-objek individu (Player, Coach, Staff)
const coachBima = new Coach("C001", "Bima", "Sakti", "1976-01-23", "Head Coach");
const playerEgy = new Player("P001", "Egy", "Maulana", "2000-07-07", 10, "Winger");
const playerWitan = new Player("P002", "Witan", "Sulaeman", "2001-10-08", 8, "Midfielder");
const staffAdi = new Staff("S001", "Adi", "Nugroho", "1985-05-20", "Medical", "Physiotherapist");

// 2. Membuat objek Team
const u23Team = new Team("T01", "FC Cakrawala Muda (U-23)");

// 3. Masukkan Coach dan Player ke dalam Team
u23Team.addCoach(coachBima);
u23Team.addPlayer(playerEgy);
u23Team.addPlayer(playerWitan);

// 4. Membuat objek Club utama
const fcCakrawala = new Club("FC-CKW", "FC Cakrawala", "Stadion Cakrawala Megah");

// 5. Daftarkan tim ke dalam klub
fcCakrawala.addTeam(u23Team);

// 6. Rekrut semua individu ke dalam klub (ini akan otomatis membuat kontrak)
fcCakrawala.hirePerson(coachBima, {id: "KTR-001", startDate: "2024-01-01", endDate: "2026-12-31", salary: "Rp 50.000.000"});
fcCakrawala.hirePerson(playerEgy, {id: "KTR-002", startDate: "2024-07-01", endDate: "2028-06-30", salary: "Rp 30.000.000"});
fcCakrawala.hirePerson(playerWitan, {id: "KTR-003", startDate: "2024-07-01", endDate: "2028-06-30", salary: "Rp 28.000.000"});
fcCakrawala.hirePerson(staffAdi, {id: "KTR-004", startDate: "2023-02-01", endDate: "2025-01-31", salary: "Rp 15.000.000"});

// 7. Tampilkan semua informasi untuk verifikasi
fcCakrawala.displayClubInfo();
u23Team.listRoster();
