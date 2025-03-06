import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { LuUser, LuMail, LuShield, LuCalendar, LuBuilding, LuMapPin, LuPhone, LuGlobe, LuBriefcase } from "react-icons/lu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [userType, setUserType] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingType, setIsEditingType] = useState(false);

  // Personal Details State
  const [personalDetails, setPersonalDetails] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    occupation: '',
    cpf: '',
    rg: '',
    ssn: '',
    phone: '',
    mobilePhone: '',
    address: '',
    addressNumber: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'BR'
  });

  // Business Details State
  const [businessDetails, setBusinessDetails] = useState({
    companyName: '',
    tradingName: '',
    businessType: '',
    businessCategory: '',
    cnpj: '',
    ein: '',
    stateRegistration: '',
    municipalRegistration: '',
    address: '',
    addressNumber: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    website: '',
    industry: '',
    country: 'BR'
  });

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
    
    // Fetch user details from Firestore
    const fetchUserDetails = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserType(userData.userType || 'personal');
            if (userData.userType === 'business' && userData.businessDetails) {
              setBusinessDetails(userData.businessDetails);
            } else if (userData.userType === 'personal' && userData.personalDetails) {
              const details = userData.personalDetails;
              
              setPersonalDetails({
                ...details,
                firstName: details.firstName || '',
                lastName: details.lastName || '',
                country: details.country || 'BR',
                cpf: details.cpf || '',
                rg: details.rg || '',
                ssn: details.ssn || '',
                dateOfBirth: details.dateOfBirth || '',
                gender: details.gender || '',
                nationality: details.nationality || '',
                occupation: details.occupation || '',
                phone: details.phone || '',
                mobilePhone: details.mobilePhone || '',
                address: details.address || '',
                addressNumber: details.addressNumber || '',
                complement: details.complement || '',
                neighborhood: details.neighborhood || '',
                city: details.city || '',
                state: details.state || '',
                zipCode: details.zipCode || ''
              });
            }
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          toast.error("Failed to load user details");
        }
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await updateProfile(user, {
        displayName: displayName
      });

      // Update Firestore document
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        displayName: displayName
      });

      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserType = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Update Firestore document
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        userType: userType
      });

      setIsEditingType(false);
      toast.success("Account type updated successfully");
    } catch (error) {
      console.error('Failed to update account type:', error);
      toast.error("Failed to update account type");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePersonalDetails = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', user.uid);

      await updateDoc(userDocRef, {
        personalDetails: {
          ...personalDetails,
          firstName: personalDetails.firstName,
          lastName: personalDetails.lastName
        }
      });
      toast.success("Personal details updated successfully");
    } catch (error) {
      console.error('Failed to update personal details:', error);
      toast.error("Failed to update personal details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBusinessDetails = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        businessDetails: businessDetails
      });
      toast.success("Business details updated successfully");
    } catch (error) {
      console.error('Failed to update business details:', error);
      toast.error("Failed to update business details");
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await sendEmailVerification(user);
      toast.success("Verification email sent successfully");
    } catch (error) {
      console.error('Failed to send verification email:', error);
      toast.error("Failed to send verification email");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
      toast.error("Failed to log out");
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>
      
      <ScrollArea className="flex-1 px-6">
        <div className="mx-auto max-w-4xl py-6">
          <div className="grid gap-6">
            {/* Account Type Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LuUser className="h-5 w-5" />
                  Account Type
                </CardTitle>
                <CardDescription>
                  Your account type determines what information we collect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isEditingType ? (
                    <div className="space-y-4">
                      <RadioGroup
                        value={userType}
                        onValueChange={setUserType}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="personal" id="personal" />
                          <Label htmlFor="personal">Personal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="business" id="business" />
                          <Label htmlFor="business">Business</Label>
                        </div>
                      </RadioGroup>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleUpdateUserType} 
                          disabled={loading}
                        >
                          Save
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsEditingType(false);
                            setUserType('personal');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {userType === 'personal' ? 'Personal Account' : 'Business Account'}
                        </Badge>
                      </div>
                      <Button variant="outline" onClick={() => setIsEditingType(true)}>
                        Change
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Email Verification Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LuMail className="h-5 w-5" />
                  Email Verification
                </CardTitle>
                <CardDescription>
                  Verify your email address to secure your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LuShield className={user?.emailVerified ? "text-green-500" : "text-yellow-500"} />
                    <span className="text-muted-foreground">
                      {user?.emailVerified ? 'Verified' : 'Not verified'}
                    </span>
                  </div>
                  {!user?.emailVerified && (
                    <Button 
                      variant="outline" 
                      onClick={handleSendVerificationEmail}
                      disabled={loading}
                    >
                      Send Verification Email
                    </Button>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Email: {user?.email}
                </div>
              </CardContent>
            </Card>

            {/* Personal/Business Details Card */}
            {userType === 'personal' ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LuUser className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                          value={personalDetails.firstName + ' ' + personalDetails.lastName}
                          onChange={(e) => {
                            const [firstName, lastName] = e.target.value.split(' ');
                            setPersonalDetails({
                              ...personalDetails,
                              firstName,
                              lastName
                            });
                          }}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          value={personalDetails.dateOfBirth}
                          onChange={(e) => setPersonalDetails({...personalDetails, dateOfBirth: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select
                          value={personalDetails.gender}
                          onValueChange={(value) => setPersonalDetails({...personalDetails, gender: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Nationality</Label>
                        <Input
                          value={personalDetails.nationality}
                          onChange={(e) => setPersonalDetails({...personalDetails, nationality: e.target.value})}
                          placeholder="Your nationality"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Identification */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Identification</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Select
                          value={personalDetails.country}
                          onValueChange={(value) => setPersonalDetails({...personalDetails, country: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BR">Brazil</SelectItem>
                            <SelectItem value="US">United States</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {personalDetails.country === 'BR' ? (
                        <>
                          <div className="space-y-2">
                            <Label>CPF</Label>
                            <Input
                              value={personalDetails.cpf}
                              onChange={(e) => setPersonalDetails({...personalDetails, cpf: e.target.value})}
                              placeholder="000.000.000-00"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>RG</Label>
                            <Input
                              value={personalDetails.rg}
                              onChange={(e) => setPersonalDetails({...personalDetails, rg: e.target.value})}
                              placeholder="00.000.000-0"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <Label>SSN</Label>
                          <Input
                            type="password"
                            value={personalDetails.ssn}
                            onChange={(e) => setPersonalDetails({...personalDetails, ssn: e.target.value})}
                            placeholder="XXX-XX-XXXX"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={personalDetails.phone}
                          onChange={(e) => setPersonalDetails({...personalDetails, phone: e.target.value})}
                          placeholder="Home phone"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Mobile Phone</Label>
                        <Input
                          value={personalDetails.mobilePhone}
                          onChange={(e) => setPersonalDetails({...personalDetails, mobilePhone: e.target.value})}
                          placeholder="Mobile phone"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Address</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Street</Label>
                        <Input
                          value={personalDetails.address}
                          onChange={(e) => setPersonalDetails({...personalDetails, address: e.target.value})}
                          placeholder="Street address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Number</Label>
                        <Input
                          value={personalDetails.addressNumber}
                          onChange={(e) => setPersonalDetails({...personalDetails, addressNumber: e.target.value})}
                          placeholder="Building number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Complement</Label>
                        <Input
                          value={personalDetails.complement}
                          onChange={(e) => setPersonalDetails({...personalDetails, complement: e.target.value})}
                          placeholder="Apartment, suite, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Neighborhood</Label>
                        <Input
                          value={personalDetails.neighborhood}
                          onChange={(e) => setPersonalDetails({...personalDetails, neighborhood: e.target.value})}
                          placeholder="Neighborhood"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          value={personalDetails.city}
                          onChange={(e) => setPersonalDetails({...personalDetails, city: e.target.value})}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input
                          value={personalDetails.state}
                          onChange={(e) => setPersonalDetails({...personalDetails, state: e.target.value})}
                          placeholder="State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ZIP Code</Label>
                        <Input
                          value={personalDetails.zipCode}
                          onChange={(e) => setPersonalDetails({...personalDetails, zipCode: e.target.value})}
                          placeholder={personalDetails.country === 'BR' ? 'CEP' : 'ZIP Code'}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button onClick={handleUpdatePersonalDetails} disabled={loading}>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LuBuilding className="h-5 w-5" />
                    Business Information
                  </CardTitle>
                  <CardDescription>
                    Your business details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Business Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Legal Company Name</Label>
                        <Input
                          value={businessDetails.companyName}
                          onChange={(e) => setBusinessDetails({...businessDetails, companyName: e.target.value})}
                          placeholder="Legal company name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Trading Name (DBA)</Label>
                        <Input
                          value={businessDetails.tradingName}
                          onChange={(e) => setBusinessDetails({...businessDetails, tradingName: e.target.value})}
                          placeholder="Doing Business As name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Business Type</Label>
                        <Select
                          value={businessDetails.businessType}
                          onValueChange={(value) => setBusinessDetails({...businessDetails, businessType: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            {businessDetails.country === 'BR' ? (
                              <>
                                <SelectItem value="mei">MEI</SelectItem>
                                <SelectItem value="eireli">EIRELI</SelectItem>
                                <SelectItem value="ltda">LTDA</SelectItem>
                                <SelectItem value="sa">S.A.</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="llc">LLC</SelectItem>
                                <SelectItem value="corporation">Corporation</SelectItem>
                                <SelectItem value="partnership">Partnership</SelectItem>
                                <SelectItem value="soleProprietorship">Sole Proprietorship</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Business Category</Label>
                        <Select
                          value={businessDetails.businessCategory}
                          onValueChange={(value) => setBusinessDetails({...businessDetails, businessCategory: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select business category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="retail">Retail Store</SelectItem>
                            <SelectItem value="restaurant">Restaurant/Food Service</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="technology">Technology/Software</SelectItem>
                            <SelectItem value="healthcare">Healthcare Services</SelectItem>
                            <SelectItem value="construction">Construction</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="professional_services">Professional Services</SelectItem>
                            <SelectItem value="real_estate">Real Estate</SelectItem>
                            <SelectItem value="automotive">Automotive</SelectItem>
                            <SelectItem value="hospitality">Hospitality</SelectItem>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                            <SelectItem value="agriculture">Agriculture</SelectItem>
                            <SelectItem value="transportation">Transportation/Logistics</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Business Registration */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Business Registration</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {businessDetails.country === 'BR' ? (
                        <>
                          <div className="space-y-2">
                            <Label>CNPJ</Label>
                            <Input
                              value={businessDetails.cnpj}
                              onChange={(e) => setBusinessDetails({...businessDetails, cnpj: e.target.value})}
                              placeholder="00.000.000/0000-00"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>State Registration</Label>
                            <Input
                              value={businessDetails.stateRegistration}
                              onChange={(e) => setBusinessDetails({...businessDetails, stateRegistration: e.target.value})}
                              placeholder="State registration number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Municipal Registration</Label>
                            <Input
                              value={businessDetails.municipalRegistration}
                              onChange={(e) => setBusinessDetails({...businessDetails, municipalRegistration: e.target.value})}
                              placeholder="Municipal registration number"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <Label>EIN (Employer Identification Number)</Label>
                          <Input
                            value={businessDetails.ein}
                            onChange={(e) => setBusinessDetails({...businessDetails, ein: e.target.value})}
                            placeholder="XX-XXXXXXX"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Business Phone</Label>
                        <Input
                          value={businessDetails.phone}
                          onChange={(e) => setBusinessDetails({...businessDetails, phone: e.target.value})}
                          placeholder="Business phone"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Website</Label>
                        <Input
                          value={businessDetails.website}
                          onChange={(e) => setBusinessDetails({...businessDetails, website: e.target.value})}
                          placeholder="Business website"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Business Address</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Street</Label>
                        <Input
                          value={businessDetails.address}
                          onChange={(e) => setBusinessDetails({...businessDetails, address: e.target.value})}
                          placeholder="Street address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Number</Label>
                        <Input
                          value={businessDetails.addressNumber}
                          onChange={(e) => setBusinessDetails({...businessDetails, addressNumber: e.target.value})}
                          placeholder="Building number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Complement</Label>
                        <Input
                          value={businessDetails.complement}
                          onChange={(e) => setBusinessDetails({...businessDetails, complement: e.target.value})}
                          placeholder="Suite, floor, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Neighborhood</Label>
                        <Input
                          value={businessDetails.neighborhood}
                          onChange={(e) => setBusinessDetails({...businessDetails, neighborhood: e.target.value})}
                          placeholder="Neighborhood"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          value={businessDetails.city}
                          onChange={(e) => setBusinessDetails({...businessDetails, city: e.target.value})}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input
                          value={businessDetails.state}
                          onChange={(e) => setBusinessDetails({...businessDetails, state: e.target.value})}
                          placeholder="State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ZIP Code</Label>
                        <Input
                          value={businessDetails.zipCode}
                          onChange={(e) => setBusinessDetails({...businessDetails, zipCode: e.target.value})}
                          placeholder={businessDetails.country === 'BR' ? 'CEP' : 'ZIP Code'}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button onClick={handleUpdateBusinessDetails} disabled={loading}>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>
                  Manage your account security and access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
} 