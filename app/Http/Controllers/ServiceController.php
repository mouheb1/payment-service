<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Display the services.
     */
    public function index()
    {
        // Fetch all services
        $services = Service::all();

        // Pass data to the frontend
        return Inertia::render('Services/Index', [
            'services' => $services,
        ]);
    }
}
