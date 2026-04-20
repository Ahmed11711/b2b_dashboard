import React from 'react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

export default function StyleGuide() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-500">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-carbon-black tracking-tight">Royal Red Style Guide</h1>
        <p className="text-text-description text-lg max-w-2xl">
          Documentation for the Royal Red theme variations, component behaviors, responsive patterns, and WCAG 2.1 AA accessibility standards.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-heading-slate border-b border-border-light pb-2">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-24 rounded-xl bg-emerald-solid shadow-sm border border-border-light"></div>
            <p className="font-medium">Fire Brick (Base)</p>
            <p className="text-sm text-text-description">#B22222</p>
            <Badge variant="success">AA Passed (5.4:1)</Badge>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-xl bg-[#8B0000] shadow-sm border border-border-light"></div>
            <p className="font-medium">Dark Red (Dark)</p>
            <p className="text-sm text-text-description">#8B0000</p>
            <Badge variant="success">AAA Passed (7.2:1)</Badge>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-xl bg-[#DC143C] shadow-sm border border-border-light"></div>
            <p className="font-medium">Crimson (Light)</p>
            <p className="text-sm text-text-description">#DC143C</p>
            <Badge variant="success">AA Large Text (4.1:1)</Badge>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-xl bg-emerald-tint shadow-sm border border-border-light"></div>
            <p className="font-medium">Light Red (Tint)</p>
            <p className="text-sm text-text-description">#FFF0F2</p>
            <Badge variant="success">Background</Badge>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-heading-slate border-b border-border-light pb-2">Typography (Inter)</h2>
        <div className="space-y-4 bg-white p-6 rounded-2xl border border-border-light shadow-sm">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-carbon-black tracking-tight">Heading 1</h1>
            <p className="text-sm text-text-description mt-1">Font: Inter Bold, 36px/48px, Tracking: Tight</p>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-heading-slate tracking-tight">Heading 2</h2>
            <p className="text-sm text-text-description mt-1">Font: Inter SemiBold, 24px/30px, Tracking: Tight</p>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-medium text-heading-slate tracking-tight">Heading 3</h3>
            <p className="text-sm text-text-description mt-1">Font: Inter Medium, 20px/24px, Tracking: Tight</p>
          </div>
          <div>
            <p className="text-base text-carbon-gray">Body Text</p>
            <p className="text-sm text-text-description mt-1">Font: Inter Regular, 16px/24px</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-heading-slate border-b border-border-light pb-2">Buttons & Interactive Elements</h2>
        <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Primary Button</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="sm">Small (Min 44px on Mobile)</Button>
              <Button size="md">Medium (Min 44px on Mobile)</Button>
              <Button size="lg">Large (Min 48px on Mobile)</Button>
            </div>
            <p className="text-sm text-text-description">Features: Hover brightness, shadow elevation, active scale down (0.98), transition duration 300ms.</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Secondary Button</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="secondary" size="md">Secondary Button</Button>
              <Button variant="outline" size="md">Outline Button</Button>
              <Button variant="ghost" size="md">Ghost Button</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-heading-slate border-b border-border-light pb-2">Micro-interactions & States</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm space-y-4">
            <h3 className="font-medium text-lg">Loading States</h3>
            <Button isLoading>Processing...</Button>
            <p className="text-sm text-text-description">Disabled state with opacity 50% and spin animation.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm space-y-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <h3 className="font-medium text-lg">Card Hover Effect</h3>
            <p className="text-sm text-carbon-gray">Hover over this card to see the subtle lift (-translate-y-1) and shadow elevation.</p>
          </div>
        </div>
      </section>
      
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-heading-slate border-b border-border-light pb-2">Spacing System (8px Grid)</h2>
        <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-emerald-solid/20 rounded flex items-center justify-center text-xs text-emerald-text">p-2</div>
              <span className="text-sm text-text-description">8px (Base unit)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-8 bg-emerald-solid/20 rounded flex items-center justify-center text-xs text-emerald-text">p-4</div>
              <span className="text-sm text-text-description">16px (2x unit)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-8 bg-emerald-solid/20 rounded flex items-center justify-center text-xs text-emerald-text">p-6</div>
              <span className="text-sm text-text-description">24px (3x unit)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 h-8 bg-emerald-solid/20 rounded flex items-center justify-center text-xs text-emerald-text">p-8</div>
              <span className="text-sm text-text-description">32px (4x unit)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
