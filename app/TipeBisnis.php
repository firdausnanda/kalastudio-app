<?php

namespace App;

enum TipeBisnis: string
{
    case KULINER = 'Kuliner & Restoran';
    case FASHION = 'Fashion & Pakaian';
    case RETAIL = 'Retail & Toko';
    case JASA = 'Jasa & Profesional';
    case AGENCY = 'Agency Kreatif';
    case TEKNOLOGI = 'Teknologi & Software';
    case PENDIDIKAN = 'Pendidikan & Kursus';
    case KESEHATAN = 'Kesehatan & Kecantikan';
    case PETERNAKAN = 'Peternakan';
    case PERTANIAN = 'Pertanian';
    case PROPERTI = 'Properti';
    case PRIBADI = 'Keperluan Pribadi';
    case LOGISTIK = 'Logistik & Pengiriman';
    case LAINNYA = 'Lainnya';

    public static function all(): array
    {
        return array_column(self::cases(), 'value');
    }
}
