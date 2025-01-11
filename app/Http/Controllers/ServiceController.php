<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Display a listing of the services.
     */
    public function index()
    {
        // Fetch all services from the database
        $services = Service::all();

        // Pass data to the Services page
        return Inertia::render('Services/Index', [
            'services' => $services,
        ]);
    }
}
