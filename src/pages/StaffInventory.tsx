
import React, { useState, ChangeEvent, CSSProperties, ReactNode } from 'react';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  icon: string;
  stock: number;
  threshold: number;
  reorderAt: number;
}

type StockStatus = 'good' | 'warning' | 'critical';
type FilterType = 'all' | 'low' | 'critical';
type StatVariant = 'normal' | 'warning' | 'critical';

interface StatCardProps {
  label: string;
  value: number;
  variant?: StatVariant;
}

interface FilterButtonProps {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  variant: 'all' | 'low' | 'critical';
}

interface InventoryItemProps {
  item: InventoryItem;
  status: StockStatus;
  onRestock: () => void;
}

const StaffInventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: 'Natracare Tampons (Regular)', category: 'Feminine Care', icon: '🩸', stock: 87, threshold: 30, reorderAt: 20 },
    { id: 2, name: 'Natracare Tampons (Super)', category: 'Feminine Care', icon: '🩸', stock: 92, threshold: 30, reorderAt: 20 },
    { id: 3, name: 'Natracare Pads (Regular)', category: 'Feminine Care', icon: '🩸', stock: 23, threshold: 30, reorderAt: 20 },
    { id: 4, name: 'Meliora Stain Stick', category: 'Stain Removal', icon: '🧼', stock: 156, threshold: 40, reorderAt: 25 },
    { id: 5, name: "Tom's Mouthwash Packs", category: 'Oral Care', icon: '🦷', stock: 8, threshold: 50, reorderAt: 30 },
    { id: 6, name: 'Native Deodorant Singles', category: 'Body Care', icon: '💨', stock: 45, threshold: 40, reorderAt: 25 },
    { id: 7, name: 'Goodwipes Body Wipes', category: 'Body Care', icon: '🧻', stock: 201, threshold: 50, reorderAt: 30 },
    { id: 8, name: 'Lansinoh Breast Pads', category: 'Nursing', icon: '🍼', stock: 67, threshold: 30, reorderAt: 20 },
    { id: 9, name: 'Kitsch Hair Ties', category: 'Grooming', icon: '💇', stock: 134, threshold: 40, reorderAt: 25 },
    { id: 10, name: 'Advil Singles', category: 'Pain Relief', icon: '💊', stock: 78, threshold: 30, reorderAt: 20 },
    { id: 11, name: 'Everyone Hand Sanitizer', category: 'Hand Care', icon: '🧴', stock: 112, threshold: 40, reorderAt: 25 },
    { id: 12, name: 'Blowfish Tablets', category: 'Hangover', icon: '🥴', stock: 56, threshold: 30, reorderAt: 20 }
  ]);

  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [showRestockForm, setShowRestockForm] = useState<boolean>(false);
  const [currentRestockItem, setCurrentRestockItem] = useState<InventoryItem | null>(null);
  const [restockQuantity, setRestockQuantity] = useState<string>('');
  const [staffName, setStaffName] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('soho');

  const getStockStatus = (item: InventoryItem): StockStatus => {
    if (item.stock <= item.reorderAt) return 'critical';
    if (item.stock <= item.threshold) return 'warning';
    return 'good';
  };

  const getFilteredItems = (): InventoryItem[] => {
    if (currentFilter === 'all') return inventory;
    if (currentFilter === 'low') {
      return inventory.filter(item => getStockStatus(item) === 'warning');
    }
    if (currentFilter === 'critical') {
      return inventory.filter(item => getStockStatus(item) === 'critical');
    }
    return inventory;
  };

  const stats = {
    total: inventory.length,
    low: inventory.filter(item => getStockStatus(item) === 'warning').length,
    critical: inventory.filter(item => getStockStatus(item) === 'critical').length,
    inStock: inventory.length - inventory.filter(item => getStockStatus(item) === 'critical').length
  };

  const openRestockForm = (item: InventoryItem): void => {
    setCurrentRestockItem(item);
    setRestockQuantity('');
    setStaffName('');
    setShowRestockForm(true);
  };

  const closeRestockForm = (): void => {
    setShowRestockForm(false);
    setCurrentRestockItem(null);
  };

  const submitRestock = (): void => {
    const quantity = parseInt(restockQuantity);

    if (!quantity || quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (!staffName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!currentRestockItem) return;

    // Update inventory
    setInventory(prev => prev.map(item =>
      item.id === currentRestockItem.id
        ? { ...item, stock: item.stock + quantity }
        : item
    ));

    // Log restock (will save to Supabase later)
    console.log('Restock logged:', {
      product: currentRestockItem.name,
      quantity: quantity,
      staff: staffName,
      timestamp: new Date().toISOString()
    });

    closeRestockForm();
  };

  const handleRestockQuantityChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setRestockQuantity(e.target.value);
  };

  const handleStaffNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setStaffName(e.target.value);
  };

  const handleLocationChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedLocation(e.target.value);
  };

  const filteredItems = getFilteredItems();

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#f5f5f5',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Icon */}
        <div style={{
          width: '60px',
          height: '60px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="60" height="60" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Circular arrows */}
            <path d="M100 20 A80 80 0 1 1 100 180" stroke="#333" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d="M100 180 A80 80 0 1 1 100 20" stroke="#333" strokeWidth="6" fill="none" strokeLinecap="round"/>
            {/* Arrow heads */}
            <path d="M110 25 L100 15 L90 25" stroke="#333" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M90 175 L100 185 L110 175" stroke="#333" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

            {/* Box - front face */}
            <path d="M100 65 L140 85 L140 125 L100 145 L60 125 L60 85 Z" fill="#E8945F" stroke="#333" strokeWidth="4"/>

            {/* Box - top face */}
            <path d="M100 65 L140 85 L100 105 L60 85 Z" fill="#C77A4D" stroke="#333" strokeWidth="4"/>

            {/* Box - side face */}
            <path d="M100 65 L100 105 L60 85 Z" fill="#A66439" stroke="#333" strokeWidth="4"/>

            {/* Red stripe on box */}
            <path d="M100 65 L115 73 L115 133 L100 145 Z" fill="#B83B3B" stroke="#333" strokeWidth="3"/>

            {/* Checkmark circle */}
            <circle cx="145" cy="135" r="22" fill="white" stroke="#333" strokeWidth="4"/>
            {/* Checkmark */}
            <path d="M135 135 L142 142 L155 125" stroke="#333" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '24px', color: '#333', marginBottom: '5px', margin: 0 }}>Inventory Management</h1>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Track and restock sample products</p>
        </div>
      </div>

      {/* Location Selector */}
      <div style={{
        background: 'white',
        padding: '15px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#333' }}>
          Location:
        </label>
        <select
          value={selectedLocation}
          onChange={handleLocationChange}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '16px',
            background: 'white'
          }}
        >
          <option value="soho">SoHo - 123 Spring St</option>
          <option value="tribeca">TriBeCa - Coming Soon</option>
          <option value="midtown">Midtown - Coming Soon</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <StatCard label="Total Items" value={stats.total} />
        <StatCard label="In Stock" value={stats.inStock} />
        <StatCard label="Low Stock" value={stats.low} variant="warning" />
        <StatCard label="Critical" value={stats.critical} variant="critical" />
      </div>

      {/* Inventory Section */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '2px solid #f0f0f0',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <h2 style={{ fontSize: '18px', color: '#333', margin: 0 }}>Sample Products</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <FilterButton
              active={currentFilter === 'all'}
              onClick={() => setCurrentFilter('all')}
              variant="all"
            >
              All
            </FilterButton>
            <FilterButton
              active={currentFilter === 'low'}
              onClick={() => setCurrentFilter('low')}
              variant="low"
            >
              Low
            </FilterButton>
            <FilterButton
              active={currentFilter === 'critical'}
              onClick={() => setCurrentFilter('critical')}
              variant="critical"
            >
              Critical
            </FilterButton>
          </div>
        </div>

        {/* Inventory List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>All Stocked!</div>
              <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '10px' }}>All Stocked!</h3>
              <p style={{ margin: 0 }}>No items match this filter.</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <InventoryItemComponent
                key={item.id}
                item={item}
                status={getStockStatus(item)}
                onRestock={() => openRestockForm(item)}
              />
            ))
          )}
        </div>
      </div>

      {/* Restock Form Modal */}
      {showRestockForm && (
        <div
          onClick={closeRestockForm}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              maxWidth: '400px',
              width: '100%'
            }}
          >
            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>Restock Product</h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#333', fontSize: '14px' }}>
                Product:
              </label>
              <input
                type="text"
                value={currentRestockItem?.name || ''}
                readOnly
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#f9fafb'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#333', fontSize: '14px' }}>
                Quantity Added:
              </label>
              <input
                type="number"
                min="1"
                value={restockQuantity}
                onChange={handleRestockQuantityChange}
                placeholder="Enter quantity"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#333', fontSize: '14px' }}>
                Staff Name:
              </label>
              <input
                type="text"
                value={staffName}
                onChange={handleStaffNameChange}
                placeholder="Your name"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={closeRestockForm}
                style={{
                  flex: 1,
                  padding: '14px',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer',
                  background: '#e5e7eb',
                  color: '#333'
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitRestock}
                style={{
                  flex: 1,
                  padding: '14px',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer',
                  background: '#10b981',
                  color: 'white'
                }}
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Component: Stat Card
const StatCard: React.FC<StatCardProps> = ({ label, value, variant = 'normal' }) => {
  const colors: Record<StatVariant, string> = {
    normal: '#333',
    warning: '#f59e0b',
    critical: '#ef4444'
  };

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        fontSize: '12px',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '8px'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '32px',
        fontWeight: 700,
        color: colors[variant]
      }}>
        {value}
      </div>
    </div>
  );
};

// Component: Filter Button
const FilterButton: React.FC<FilterButtonProps> = ({ children, active, onClick, variant }) => {
  const variants: Record<'all' | 'low' | 'critical', { bg: string; color: string }> = {
    all: { bg: '#e5e7eb', color: '#333' },
    low: { bg: '#fef3c7', color: '#92400e' },
    critical: { bg: '#fee2e2', color: '#991b1b' }
  };

  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        background: variants[variant].bg,
        color: variants[variant].color,
        transform: active ? 'scale(1.05)' : 'scale(1)',
        boxShadow: active ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
        transition: 'all 0.2s'
      }}
    >
      {children}
    </button>
  );
};

// Component: Inventory Item
const InventoryItemComponent: React.FC<InventoryItemProps> = ({ item, status, onRestock }) => {
  const borderColors: Record<StockStatus, string> = {
    good: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444'
  };

  const bgColors: Record<StockStatus, string> = {
    good: '#f9fafb',
    warning: '#fffbeb',
    critical: '#fef2f2'
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      background: bgColors[status],
      borderRadius: '8px',
      borderLeft: `4px solid ${borderColors[status]}`,
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '8px',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        flexShrink: 0
      }}>
        {item.icon}
      </div>

      <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
        <div style={{ fontWeight: 600, color: '#333', fontSize: '16px', marginBottom: '4px' }}>
          {item.name}
        </div>
        <div style={{ fontSize: '13px', color: '#666' }}>
          {item.category}
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginRight: '15px'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: '#333' }}>
          {item.stock}
        </div>
        <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
          units
        </div>
      </div>

      <button
        onClick={onRestock}
        style={{
          padding: '10px 20px',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '14px',
          flexShrink: 0
        }}
      >
        Restock
      </button>
    </div>
  );
};

export default StaffInventory;
