<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Aimeos\MShop;

class MigrateOpencart extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:opencart';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate data from OpenCart backup to Aimeos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting OpenCart data migration...');

        // NOTE: Make sure to configure the 'opencart' database connection in config/database.php
        // and import your SQL backup into that database.
        
        try {
            DB::connection('opencart')->getPdo();
        } catch (\Exception $e) {
            $this->error('Could not connect to the opencart database. Please configure it in config/database.php and import your SQL file.');
            return 1;
        }

        $context = app('aimeos.context')->get();

        $this->migrateCategories($context);
        $this->migrateProducts($context);

        $this->info('Migration completed successfully.');
        return 0;
    }

    protected function migrateCategories($context)
    {
        $this->info('Migrating categories...');
        
        $categories = DB::connection('opencart')
            ->table('ocpa_category')
            ->join('ocpa_category_description', 'ocpa_category.category_id', '=', 'ocpa_category_description.category_id')
            ->where('ocpa_category_description.language_id', 1) // Default language
            ->get();

        $manager = \Aimeos\MShop::create($context, 'catalog');

        foreach ($categories as $cat) {
            try {
                $item = $manager->create();
                $item->setCode('oc-cat-' . $cat->category_id);
                $item->setLabel($cat->name);
                $item->setStatus((int)$cat->status);
                
                $manager->save($item);
                $this->line("Migrated category: {$cat->name}");
            } catch (\Exception $e) {
                $this->error("Failed to migrate category ID {$cat->category_id}: " . $e->getMessage());
            }
        }
    }

    protected function migrateProducts($context)
    {
        $this->info('Migrating products...');

        $products = DB::connection('opencart')
            ->table('ocpa_product')
            ->join('ocpa_product_description', 'ocpa_product.product_id', '=', 'ocpa_product_description.product_id')
            ->where('ocpa_product_description.language_id', 1) // Default language
            ->get();

        $manager = \Aimeos\MShop::create($context, 'product');

        foreach ($products as $prod) {
            try {
                $item = $manager->create();
                $item->setCode($prod->model ?: 'oc-prod-' . $prod->product_id);
                $item->setLabel($prod->name);
                $item->setStatus((int)$prod->status);
                
                // You can expand this to migrate prices, stock, images, etc.
                
                $manager->save($item);
                $this->line("Migrated product: {$prod->name}");
            } catch (\Exception $e) {
                $this->error("Failed to migrate product ID {$prod->product_id}: " . $e->getMessage());
            }
        }
    }
}
