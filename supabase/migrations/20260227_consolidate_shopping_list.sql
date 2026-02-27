-- Consolidate shopping list items by normalized component name
-- This groups similar items like "ESP32", "ESP32 DevKit", "ESP32-S3" together

-- Drop and recreate the shopping list view with better consolidation
DROP VIEW IF EXISTS shopping_list_aggregated;

CREATE VIEW shopping_list_aggregated AS
WITH normalized_components AS (
  SELECT
    pc.*,
    p.name as prototype_name,
    -- Normalize component names for grouping
    CASE
      -- ESP32 variants
      WHEN LOWER(pc.name) LIKE '%esp32%' THEN 'ESP32 Microcontroller'
      -- Raspberry Pi variants
      WHEN LOWER(pc.name) LIKE '%raspberry%' OR LOWER(pc.name) LIKE '%rpi%' THEN 'Raspberry Pi'
      -- LED strips
      WHEN LOWER(pc.name) LIKE '%ws2812%' OR LOWER(pc.name) LIKE '%neopixel%' OR LOWER(pc.name) LIKE '%led strip%' THEN 'LED Strip (WS2812/NeoPixel)'
      -- Power supplies
      WHEN LOWER(pc.name) LIKE '%5v%power%' OR LOWER(pc.name) LIKE '%power supply%5v%' THEN '5V Power Supply'
      -- RFID readers
      WHEN LOWER(pc.name) LIKE '%rfid%' OR LOWER(pc.name) LIKE '%rc522%' OR LOWER(pc.name) LIKE '%nfc%reader%' THEN 'RFID/NFC Reader'
      -- Relays
      WHEN LOWER(pc.name) LIKE '%relay%' THEN 'Relay Module'
      -- Speakers
      WHEN LOWER(pc.name) LIKE '%speaker%' THEN 'Speaker/Audio Output'
      -- Sensors (various)
      WHEN LOWER(pc.name) LIKE '%sensor%' AND LOWER(pc.name) LIKE '%motion%' THEN 'Motion Sensor'
      WHEN LOWER(pc.name) LIKE '%sensor%' AND LOWER(pc.name) LIKE '%temp%' THEN 'Temperature Sensor'
      -- Displays
      WHEN LOWER(pc.name) LIKE '%oled%' OR LOWER(pc.name) LIKE '%lcd%' OR LOWER(pc.name) LIKE '%display%' THEN 'Display Module'
      -- Buttons
      WHEN LOWER(pc.name) LIKE '%button%' OR LOWER(pc.name) LIKE '%switch%' THEN 'Button/Switch'
      -- Wiring
      WHEN LOWER(pc.name) LIKE '%wire%' OR LOWER(pc.name) LIKE '%jumper%' OR LOWER(pc.name) LIKE '%cable%' THEN 'Wiring & Cables'
      -- Breadboard/PCB
      WHEN LOWER(pc.name) LIKE '%breadboard%' OR LOWER(pc.name) LIKE '%pcb%' THEN 'Breadboard/PCB'
      -- Otherwise keep original
      ELSE pc.name
    END as normalized_name
  FROM prototype_components pc
  JOIN prototypes p ON pc.prototype_id = p.id
  WHERE pc.status IN ('need', 'ordered')
)
SELECT
  normalized_name as component_name,
  -- Take the most common vendor, or list multiple
  MODE() WITHIN GROUP (ORDER BY vendor) as vendor,
  -- Get any available vendor URL
  MAX(vendor_url) as vendor_url,
  -- Average unit price (in case of variations)
  ROUND(AVG(price)::numeric, 2) as unit_price,
  -- Total quantities
  SUM(quantity) as total_quantity,
  SUM(CASE WHEN status = 'have' THEN quantity ELSE 0 END) as quantity_have,
  SUM(CASE WHEN status = 'ordered' THEN quantity ELSE 0 END) as quantity_ordered,
  SUM(CASE WHEN status = 'need' THEN quantity ELSE 0 END) as quantity_need,
  SUM(CASE WHEN status = 'need' THEN quantity ELSE 0 END) as still_needed,
  -- Total estimated cost
  ROUND(SUM(quantity * price)::numeric, 2) as total_cost,
  -- List all prototypes using this
  STRING_AGG(DISTINCT prototype_name, ', ' ORDER BY prototype_name) as used_in_prototypes,
  COUNT(DISTINCT prototype_id) as prototype_count
FROM normalized_components
GROUP BY normalized_name
ORDER BY total_cost DESC NULLS LAST;

-- Grant access to the view
GRANT SELECT ON shopping_list_aggregated TO anon, authenticated;

COMMENT ON VIEW shopping_list_aggregated IS 'Consolidated shopping list grouping similar components (ESP32 variants, LED strips, etc.)';
