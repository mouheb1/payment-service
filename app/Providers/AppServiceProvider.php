<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use GlobalPayments\Api\ServiceConfigs\Gateways\GpApiConfig;
use GlobalPayments\Api\ServicesContainer;
use GlobalPayments\Api\Entities\Enums\Environment;
use GlobalPayments\Api\Entities\Enums\Channel;

class PaymentServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $config = new GpApiConfig();
        $config->appId = env('GLOBALPAYMENTS_APP_ID');
        $config->appKey = env('GLOBALPAYMENTS_APP_KEY');
        $config->environment = Environment::TEST; // Use Environment::PRODUCTION for live payments
        $config->channel = Channel::CardNotPresent;

        ServicesContainer::configureService($config, 'default');
    }
    
    // public function boot(): void
    // {
    //     Vite::prefetch(concurrency: 3);
    // }
}
