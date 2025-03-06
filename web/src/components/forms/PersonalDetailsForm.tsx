import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from 'react-i18next';
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

interface PersonalDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  cpf: string;
  rg: string;
  ssn: string;
  phone: string;
  mobilePhone: string;
  address: string;
  addressNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PersonalDetailsFormProps {
  onChange: (details: PersonalDetails) => void;
  defaultValues?: PersonalDetails;
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

export function PersonalDetailsForm({ onChange, defaultValues = {} as PersonalDetails }: PersonalDetailsFormProps) {
  const { t } = useTranslation('auth');
  const [formData, setFormData] = useState<PersonalDetails>({
    firstName: defaultValues.firstName || '',
    lastName: defaultValues.lastName || '',
    dateOfBirth: defaultValues.dateOfBirth || '',
    gender: defaultValues.gender || '',
    nationality: defaultValues.nationality || 'Brasileiro(a)',
    cpf: defaultValues.cpf || '',
    rg: defaultValues.rg || '',
    ssn: defaultValues.ssn || '',
    phone: defaultValues.phone || '',
    mobilePhone: defaultValues.mobilePhone || '',
    address: defaultValues.address || '',
    addressNumber: defaultValues.addressNumber || '',
    complement: defaultValues.complement || '',
    neighborhood: defaultValues.neighborhood || '',
    city: defaultValues.city || '',
    state: defaultValues.state || '',
    zipCode: defaultValues.zipCode || '',
    country: defaultValues.country || 'BR'
  });
  const [isValidCEP, setIsValidCEP] = useState(true);
  const [isValidCPF, setIsValidCPF] = useState(true);

  const brazilianStates = [
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

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleInputChange = (field: keyof PersonalDetails) => (
    e: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof e === 'string' ? e : e.target.value,
    }));
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
        toast.error(t('register.personal_info.address.cep_not_found'));
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
      toast.error(t('register.personal_info.address.cep_error'));
    }
  };

  const formatCPF = (value: string) => {
    // Remove any non-digit character
    const digits = value.replace(/\D/g, '');
    
    // Format as 000.000.000-00
    return digits.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, (_, g1, g2, g3, g4) => {
      if (g4) return `${g1}.${g2}.${g3}-${g4}`;
      if (g3) return `${g1}.${g2}.${g3}`;
      if (g2) return `${g1}.${g2}`;
      if (g1) return g1;
      return '';
    });
  };

  const validateCPF = (cpf: string): boolean => {
    // Remove any non-digit character
    const digits = cpf.replace(/\D/g, '');
    
    // Check if it has exactly 11 digits
    if (digits.length !== 11) return false;

    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(digits)) return false;

    // Validate first digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(digits.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(digits.charAt(9))) return false;

    // Validate second digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(digits.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(digits.charAt(10))) return false;

    return true;
  };

  const handleCPFChange = (value: string) => {
    // Format the CPF and update the field
    const formattedCPF = formatCPF(value);
    
    // Validate CPF only if we have all digits
    const digits = formattedCPF.replace(/\D/g, '');
    const isValid = digits.length === 11 ? validateCPF(formattedCPF) : true;
    
    setIsValidCPF(isValid);
    setFormData(prev => ({ ...prev, cpf: formattedCPF }));
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('register.personal_info.basic.title')}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t('register.personal_info.first_name')}</Label>
            <Input
              id="firstName"
              placeholder={t('register.personal_info.first_name_placeholder')}
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t('register.personal_info.last_name')}</Label>
            <Input
              id="lastName"
              placeholder={t('register.personal_info.last_name_placeholder')}
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">{t('register.personal_info.date_of_birth')}</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange('dateOfBirth')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">{t('register.personal_info.gender')}</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender')(value)} required>
              <SelectTrigger>
                <SelectValue placeholder={t('register.personal_info.gender_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t('register.personal_info.gender_options.male')}</SelectItem>
                <SelectItem value="female">{t('register.personal_info.gender_options.female')}</SelectItem>
                <SelectItem value="other">{t('register.personal_info.gender_options.other')}</SelectItem>
                <SelectItem value="prefer_not_to_say">{t('register.personal_info.gender_options.prefer_not_to_say')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationality">{t('register.personal_info.nationality')}</Label>
            <Input
              id="nationality"
              placeholder={t('register.personal_info.nationality_placeholder')}
              value={formData.nationality}
              onChange={handleInputChange('nationality')}
              required
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Identification */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('register.personal_info.identification.title')}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cpf">{t('register.personal_info.identification.cpf')}</Label>
            <div className="relative">
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => handleCPFChange(e.target.value)}
                maxLength={14}
                required
                className={!isValidCPF && formData.cpf.length === 14 ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {!isValidCPF && formData.cpf.length === 14 && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-red-100 text-red-800 text-xs p-2 rounded shadow-lg">
                    CPF inválido. Verifique os números digitados.
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rg">{t('register.personal_info.identification.rg')}</Label>
            <Input
              id="rg"
              placeholder={t('register.personal_info.identification.rg_placeholder')}
              value={formData.rg}
              onChange={handleInputChange('rg')}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('register.personal_info.contact.title')}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">{t('register.personal_info.phone')}</Label>
            <Input
              id="phone"
              placeholder={t('register.personal_info.phone_placeholder')}
              value={formData.phone}
              onChange={handleInputChange('phone')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobilePhone">{t('register.personal_info.mobile_phone')}</Label>
            <Input
              id="mobilePhone"
              placeholder={t('register.personal_info.mobile_phone_placeholder')}
              value={formData.mobilePhone}
              onChange={handleInputChange('mobilePhone')}
              required
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('register.personal_info.address.title')}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="zipCode">CEP</Label>
            <div className="relative">
              <Input
                id="zipCode"
                placeholder="00000-000"
                value={formData.zipCode}
                onChange={(e) => {
                  const value = e.target.value;
                  handleCEPChange(value);
                }}
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
            <Label htmlFor="address">{t('register.personal_info.address.street')}</Label>
            <Input
              id="address"
              placeholder={t('register.personal_info.address.street_placeholder')}
              value={formData.address}
              onChange={handleInputChange('address')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressNumber">{t('register.personal_info.address.number')}</Label>
            <Input
              id="addressNumber"
              placeholder={t('register.personal_info.address.number_placeholder')}
              value={formData.addressNumber}
              onChange={handleInputChange('addressNumber')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complement">{t('register.personal_info.address.complement')}</Label>
            <Input
              id="complement"
              placeholder={t('register.personal_info.address.complement_placeholder')}
              value={formData.complement}
              onChange={handleInputChange('complement')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="neighborhood">{t('register.personal_info.address.neighborhood')}</Label>
            <Input
              id="neighborhood"
              placeholder={t('register.personal_info.address.neighborhood_placeholder')}
              value={formData.neighborhood}
              onChange={handleInputChange('neighborhood')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">{t('register.personal_info.address.city')}</Label>
            <Input
              id="city"
              placeholder={t('register.personal_info.address.city_placeholder')}
              value={formData.city}
              onChange={handleInputChange('city')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">{t('register.personal_info.address.state')}</Label>
            <Select 
              value={formData.state} 
              onValueChange={(value) => handleInputChange('state')(value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={t('register.personal_info.address.state_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {brazilianStates.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
} 