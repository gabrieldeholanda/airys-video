import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { toast } from "sonner";

interface BusinessDetails {
  companyName: string;
  tradingName: string;
  businessType: string;
  businessCategory: string;
  cnpj: string;
  ein: string;
  stateRegistration: string;
  municipalRegistration: string;
  address: string;
  addressNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  website: string;
  industry: string;
  country: string;
}

interface BusinessDetailsFormProps {
  onChange: (details: BusinessDetails) => void;
  defaultValues?: BusinessDetails;
}

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface BrazilianState {
  value: string;
  label: string;
}

export function BusinessDetailsForm({ onChange, defaultValues = {} as BusinessDetails }: BusinessDetailsFormProps) {
  const { t } = useTranslation('auth');
  const [isValidCNPJ, setIsValidCNPJ] = useState(true);
  const [isValidCEP, setIsValidCEP] = useState(true);
  
  const brazilianStates: BrazilianState[] = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ];

  const businessCategories = [
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'construction', label: 'Construction' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'healthcare', label: 'Healthcare Services' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'other', label: 'Other' },
    { value: 'professional_services', label: 'Professional Services' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'restaurant', label: 'Restaurant/Food Service' },
    { value: 'retail', label: 'Retail Store' },
    { value: 'technology', label: 'Technology/Software' },
    { value: 'transportation', label: 'Transportation/Logistics' }
  ];

  const [formData, setFormData] = useState<BusinessDetails>({
    companyName: defaultValues.companyName || '',
    tradingName: defaultValues.tradingName || '',
    businessType: defaultValues.businessType || 'corporation',
    businessCategory: defaultValues.businessCategory || '',
    cnpj: defaultValues.cnpj || '',
    ein: defaultValues.ein || '',
    stateRegistration: defaultValues.stateRegistration || '',
    municipalRegistration: defaultValues.municipalRegistration || '',
    address: defaultValues.address || '',
    addressNumber: defaultValues.addressNumber || '',
    complement: defaultValues.complement || '',
    neighborhood: defaultValues.neighborhood || '',
    city: defaultValues.city || '',
    state: defaultValues.state || '',
    zipCode: defaultValues.zipCode || '',
    phone: defaultValues.phone || '',
    website: defaultValues.website || '',
    industry: defaultValues.industry || '',
    country: defaultValues.country || 'BR'
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleInputChange = (field: keyof BusinessDetails) => (
    e: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof e === 'string' ? e : e.target.value,
    }));
  };

  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      country: value,
    }));
  };

  const formatCNPJ = (value: string) => {
    // Remove any non-digit character
    const digits = value.replace(/\D/g, '');
    
    // Format as 00.000.000/0000-00
    return digits.replace(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/, (_, g1, g2, g3, g4, g5) => {
      if (g5) return `${g1}.${g2}.${g3}/${g4}-${g5}`;
      if (g4) return `${g1}.${g2}.${g3}/${g4}`;
      if (g3) return `${g1}.${g2}.${g3}`;
      if (g2) return `${g1}.${g2}`;
      if (g1) return g1;
      return '';
    });
  };

  const validateCNPJ = (cnpj: string): boolean => {
    // Remove any non-digit character
    const digits = cnpj.replace(/\D/g, '');
    
    // Check if it has exactly 14 digits
    if (digits.length !== 14) return false;

    // Check if all digits are the same
    if (/^(\d)\1{13}$/.test(digits)) return false;

    // Validate first digit
    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(digits.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    let remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;
    if (firstDigit !== parseInt(digits.charAt(12))) return false;

    // Validate second digit
    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(digits.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    remainder = sum % 11;
    const secondDigit = remainder < 2 ? 0 : 11 - remainder;
    if (secondDigit !== parseInt(digits.charAt(13))) return false;

    return true;
  };

  const handleCNPJChange = (value: string) => {
    // Format the CNPJ and update the field
    const formattedCNPJ = formatCNPJ(value);
    
    // Validate CNPJ only if we have all digits
    const digits = formattedCNPJ.replace(/\D/g, '');
    const isValid = digits.length === 14 ? validateCNPJ(formattedCNPJ) : true;
    
    setIsValidCNPJ(isValid);
    setFormData(prev => ({ ...prev, cnpj: formattedCNPJ }));
  };

  const formatCEP = (value: string) => {
    // Remove any non-digit character
    const digits = value.replace(/\D/g, '');
    
    // Limit to 8 digits and format as 00000-000
    if (digits.length <= 8) {
      return digits.replace(/(\d{5})(\d{0,3})/, (_, g1, g2) => {
        if (g2) return `${g1}-${g2}`;
        if (g1) return g1;
        return '';
      });
    }
    
    // If more than 8 digits, keep only the first 8
    return digits.slice(0, 8).replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const validateCEP = (cep: string): boolean => {
    // Remove any non-digit character
    const digits = cep.replace(/\D/g, '');
    
    // Check if it has exactly 8 digits and matches the CEP pattern
    return digits.length === 8 && /^[0-9]{8}$/.test(digits);
  };

  const handleCEPChange = async (value: string) => {
    // Format the CEP and update the field
    const formattedCEP = formatCEP(value);
    setFormData(prev => ({ ...prev, zipCode: formattedCEP }));

    // Validate CEP format
    const isValid = validateCEP(formattedCEP);
    setIsValidCEP(isValid);

    // Only proceed with validation if we have a valid CEP
    if (!isValid) return;

    const digits = formattedCEP.replace(/\D/g, '');
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data: ViaCEPResponse = await response.json();

      if (data.erro) {
        toast.error(t('register.business_info.address.cep_not_found'));
        setIsValidCEP(false);
        return;
      }

      setFormData(prev => ({
        ...prev,
        address: data.logradouro || prev.address,
        complement: data.complemento || prev.complement,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }));
    } catch (error) {
      console.error('Error fetching CEP:', error);
      toast.error(t('register.business_info.address.cep_error'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="country">{t('register.business_info.country')}</Label>
        <Select value={formData.country} onValueChange={handleCountryChange}>
          <SelectTrigger>
            <SelectValue placeholder={t('register.business_info.country_placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {[
              { value: 'BR', label: 'Brazil' },
              { value: 'US', label: 'United States' }
            ].map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {t(`register.countries.${country.label.toLowerCase().replace(' ', '_')}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessType">{t('register.business_info.business_type')}</Label>
        <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType')(value)} required>
          <SelectTrigger>
            <SelectValue placeholder={t('register.business_info.business_type_placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {formData.country === 'BR' ? (
              <>
                <SelectItem value="mei">{t('register.business_info.types.mei')}</SelectItem>
                <SelectItem value="eireli">{t('register.business_info.types.eireli')}</SelectItem>
                <SelectItem value="ltda">{t('register.business_info.types.ltda')}</SelectItem>
                <SelectItem value="sa">{t('register.business_info.types.sa')}</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="corporation">{t('register.business_info.types.corporation')}</SelectItem>
                <SelectItem value="llc">{t('register.business_info.types.llc')}</SelectItem>
                <SelectItem value="partnership">{t('register.business_info.types.partnership')}</SelectItem>
                <SelectItem value="soleProprietorship">{t('register.business_info.types.sole_proprietorship')}</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessCategory">{t('register.business_info.business_category')}</Label>
        <Select value={formData.businessCategory} onValueChange={(value) => handleInputChange('businessCategory')(value)} required>
          <SelectTrigger>
            <SelectValue placeholder={t('register.business_info.business_category_placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {businessCategories.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {t(`register.business_info.categories.${value}`, label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="companyName">{t('register.business_info.company_name')}</Label>
          <Input
            id="companyName"
            placeholder={t('register.business_info.company_name_placeholder')}
            value={formData.companyName}
            onChange={handleInputChange('companyName')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tradingName">{t('register.business_info.trading_name')}</Label>
          <Input
            id="tradingName"
            placeholder={t('register.business_info.trading_name_placeholder')}
            value={formData.tradingName}
            onChange={handleInputChange('tradingName')}
            required
          />
        </div>
      </div>

      {formData.country === 'BR' ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="cnpj">{t('register.business_info.registration_number')}</Label>
            <div className="relative">
              <Input
                id="cnpj"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={(e) => handleCNPJChange(e.target.value)}
                maxLength={18}
                required
                className={!isValidCNPJ && formData.cnpj.length === 18 ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {!isValidCNPJ && formData.cnpj.length === 18 && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-red-100 text-red-800 text-xs p-2 rounded shadow-lg">
                    CNPJ inválido. Verifique os números digitados.
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stateRegistration">{t('register.business_info.state_registration')}</Label>
              <Input
                id="stateRegistration"
                placeholder={t('register.business_info.state_registration_placeholder')}
                value={formData.stateRegistration}
                onChange={handleInputChange('stateRegistration')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="municipalRegistration">{t('register.business_info.municipal_registration')}</Label>
              <Input
                id="municipalRegistration"
                placeholder={t('register.business_info.municipal_registration_placeholder')}
                value={formData.municipalRegistration}
                onChange={handleInputChange('municipalRegistration')}
                required
              />
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="ein">{t('register.business_info.ein')}</Label>
          <Input
            id="ein"
            placeholder={t('register.business_info.ein_placeholder')}
            value={formData.ein}
            onChange={handleInputChange('ein')}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="phone">{t('register.business_info.phone')}</Label>
        <Input
          id="phone"
          placeholder={t('register.business_info.phone_placeholder')}
          value={formData.phone}
          onChange={handleInputChange('phone')}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">{t('register.business_info.website')}</Label>
        <Input
          id="website"
          placeholder={t('register.business_info.website_placeholder')}
          value={formData.website}
          onChange={handleInputChange('website')}
          required
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('register.business_info.address.title')}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="zipCode">{formData.country === 'BR' ? 'CEP' : 'ZIP Code'}</Label>
            <div className="relative">
              <Input
                id="zipCode"
                placeholder={formData.country === 'BR' ? '00000-000' : 'ZIP Code'}
                value={formData.zipCode}
                onChange={(e) => handleCEPChange(e.target.value)}
                maxLength={9}
                required
                className={!isValidCEP && formData.zipCode ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {!isValidCEP && formData.zipCode && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-red-100 text-red-800 text-xs p-2 rounded shadow-lg">
                    CEP inválido. Use o formato: 00000-000
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">{t('register.business_info.address.street')}</Label>
            <Input
              id="address"
              placeholder={t('register.business_info.address.street_placeholder')}
              value={formData.address}
              onChange={handleInputChange('address')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressNumber">{t('register.business_info.address.number')}</Label>
            <Input
              id="addressNumber"
              placeholder={t('register.business_info.address.number_placeholder')}
              value={formData.addressNumber}
              onChange={handleInputChange('addressNumber')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complement">{t('register.business_info.address.complement')}</Label>
            <Input
              id="complement"
              placeholder={t('register.business_info.address.complement_placeholder')}
              value={formData.complement}
              onChange={handleInputChange('complement')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="neighborhood">{t('register.business_info.address.neighborhood')}</Label>
            <Input
              id="neighborhood"
              placeholder={t('register.business_info.address.neighborhood_placeholder')}
              value={formData.neighborhood}
              onChange={handleInputChange('neighborhood')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">{t('register.business_info.address.city')}</Label>
            <Input
              id="city"
              placeholder={t('register.business_info.address.city_placeholder')}
              value={formData.city}
              onChange={handleInputChange('city')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">{t('register.business_info.address.state')}</Label>
            {formData.country === 'BR' ? (
              <Select 
                value={formData.state} 
                onValueChange={(value) => handleInputChange('state')(value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('register.business_info.address.state_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((state: BrazilianState) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="state"
                placeholder={t('register.business_info.address.state_placeholder')}
                value={formData.state}
                onChange={handleInputChange('state')}
                required
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 