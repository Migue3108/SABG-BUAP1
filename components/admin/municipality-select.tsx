"use client";

import { useState, useRef, useEffect } from "react";
import { Building, ChevronDown, Check, Search, X } from "lucide-react";
import {
  PUEBLA_MUNICIPALITIES,
  INSTITUTIONAL_AFFILIATIONS,
} from "@/config/puebla-municipalities";

type MunicipalitySelectProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
};

export function MunicipalitySelect({
  value,
  onChange,
  label = "Municipio o Institución",
  placeholder = "Selecciona o busca un municipio de Puebla...",
  required = false,
}: MunicipalitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalizedSearch = search.toLowerCase().trim();

  const filteredMunicipalities = PUEBLA_MUNICIPALITIES.filter((m) =>
    m.toLowerCase().includes(normalizedSearch)
  );

  const filteredAffiliations = INSTITUTIONAL_AFFILIATIONS.filter((a) =>
    a.toLowerCase().includes(normalizedSearch)
  );

  function handleSelect(val: string) {
    onChange(val);
    setIsOpen(false);
    setSearch("");
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
    setSearch("");
  }

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
        {label} {required && "*"}
      </label>

      {/* Button trigger */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className={`w-full flex items-center justify-between rounded-xl border bg-background px-3.5 py-2.5 text-left text-sm transition ${
          isOpen
            ? "border-primary ring-1 ring-primary"
            : "border-border hover:border-text-muted"
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <Building className="h-4 w-4 text-text-muted shrink-0" />
          <span
            className={`truncate ${
              value ? "text-text-primary font-medium" : "text-text-muted"
            }`}
          >
            {value || placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {value && (
            <span
              onClick={handleClear}
              className="rounded p-1 hover:bg-surface text-text-muted hover:text-text-primary transition"
              title="Borrar selección"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
              isOpen ? "rotate-180 text-primary" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Search bar inside dropdown */}
          <div className="p-2 border-b border-border bg-background sticky top-0 z-10">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar entre los 217 municipios..."
                className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Results list */}
          <div className="max-h-56 overflow-y-auto p-1 text-xs">
            {/* 217 Municipios */}
            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-surface-soft rounded">
              Municipios del Estado de Puebla ({filteredMunicipalities.length})
            </div>

            {filteredMunicipalities.length > 0 ? (
              filteredMunicipalities.map((municipality) => {
                const isSelected = value === municipality;
                return (
                  <button
                    key={municipality}
                    type="button"
                    onClick={() => handleSelect(municipality)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                      isSelected
                        ? "bg-primary-light font-semibold text-primary"
                        : "text-text-primary hover:bg-background"
                    }`}
                  >
                    <span>{municipality}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-text-muted">
                No se encontró ningún municipio con &ldquo;{search}&rdquo;
              </div>
            )}

            {/* Dependencias Universitarias / Académicas */}
            {filteredAffiliations.length > 0 && (
              <>
                <div className="mt-2 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-surface-soft rounded">
                  Dependencias Universitarias e Institucionales ({filteredAffiliations.length})
                </div>
                {filteredAffiliations.map((affiliation) => {
                  const isSelected = value === affiliation;
                  return (
                    <button
                      key={affiliation}
                      type="button"
                      onClick={() => handleSelect(affiliation)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                        isSelected
                          ? "bg-primary-light font-semibold text-primary"
                          : "text-text-primary hover:bg-background"
                      }`}
                    >
                      <span>{affiliation}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

