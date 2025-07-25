import React, { useState, useCallback } from 'react';
import { Users, TrendingUp, TrendingDown, BarChart3, AlertCircle } from 'lucide-react';

interface AgeData {
  ages: number[];
  menores: number;
  adultos: number;
  mayores: number;
  edadMinima: number;
  edadMaxima: number;
  edadPromedio: number;
}

function App() {
  const [ages, setAges] = useState<string[]>(Array(10).fill(''));
  const [errors, setErrors] = useState<string[]>(Array(10).fill(''));
  const [results, setResults] = useState<AgeData | null>(null);

  const validateAge = useCallback((value: string): string => {
    if (!value) return 'Por favor ingrese una edad';
    const age = parseInt(value);
    if (isNaN(age)) return 'Por favor ingrese un número válido';
    if (age < 1 || age > 120) return 'La edad debe estar entre 1 y 120 años';
    return '';
  }, []);

  const handleAgeChange = (index: number, value: string) => {
    const newAges = [...ages];
    const newErrors = [...errors];
    
    newAges[index] = value;
    newErrors[index] = validateAge(value);
    
    setAges(newAges);
    setErrors(newErrors);
  };

  const calculateStatistics = () => {
    // Validate all inputs
    const newErrors = ages.map(age => validateAge(age));
    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = newErrors.some(error => error !== '');
    if (hasErrors) {
      setResults(null);
      return;
    }

    // Convert to numbers and calculate statistics
    const numericAges = ages.map(age => parseInt(age));
    
    const menores = numericAges.filter(age => age < 18).length;
    const adultos = numericAges.filter(age => age >= 18 && age < 60).length;
    const mayores = numericAges.filter(age => age >= 60).length;
    
    const edadMinima = Math.min(...numericAges);
    const edadMaxima = Math.max(...numericAges);
    const edadPromedio = numericAges.reduce((sum, age) => sum + age, 0) / numericAges.length;

    setResults({
      ages: numericAges,
      menores,
      adultos,
      mayores,
      edadMinima,
      edadMaxima,
      edadPromedio: Math.round(edadPromedio * 100) / 100
    });
  };

  const resetForm = () => {
    setAges(Array(10).fill(''));
    setErrors(Array(10).fill(''));
    setResults(null);
  };

  const allFieldsFilled = ages.every(age => age !== '');
  const hasValidationErrors = errors.some(error => error !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Programa de Análisis de Edades</h1>
          </div>
          <p className="text-gray-600">
            Ingrese la edad de 10 personas para obtener un análisis estadístico
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Ingreso de Edades (1-120 años)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {ages.map((age, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Persona {index + 1}
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => handleAgeChange(index, e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    errors[index] 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Edad"
                />
                {errors[index] && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{errors[index]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={calculateStatistics}
              disabled={!allFieldsFilled || hasValidationErrors}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Calcular Estadísticas
            </button>
            <button
              onClick={resetForm}
              className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Reiniciar
            </button>
          </div>
        </div>

        {results && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Análisis Estadístico
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-800 mb-2">Menores de Edad</h3>
                <p className="text-2xl font-bold text-blue-600">{results.menores}</p>
                <p className="text-sm text-blue-600">menores de 18 años</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <h3 className="font-semibold text-green-800 mb-2">Adultos</h3>
                <p className="text-2xl font-bold text-green-600">{results.adultos}</p>
                <p className="text-sm text-green-600">18-59 años</p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                <h3 className="font-semibold text-orange-800 mb-2">Adultos Mayores</h3>
                <p className="text-2xl font-bold text-orange-600">{results.mayores}</p>
                <p className="text-sm text-orange-600">60+ años</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingDown className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Edad Mínima</h3>
                </div>
                <p className="text-2xl font-bold text-gray-700">{results.edadMinima} años</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Edad Máxima</h3>
                </div>
                <p className="text-2xl font-bold text-gray-700">{results.edadMaxima} años</p>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600 mr-2" />
                  <h3 className="font-semibold text-indigo-800">Edad Promedio</h3>
                </div>
                <p className="text-2xl font-bold text-indigo-700">{results.edadPromedio} años</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Edades Ingresadas:</h4>
              <div className="flex flex-wrap gap-2">
                {results.ages.map((age, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      age < 18
                        ? 'bg-blue-100 text-blue-800'
                        : age < 60
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {age} años
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;