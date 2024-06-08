const API_URL = 'http://192.168.18.4:8000/'; // Cambia esta URL por la URL de tu API

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}user/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail || 'Error en la solicitud de inicio de sesión');
    }

    const data = await response.json();
    if (!data.user) {
      throw new Error('La respuesta no contiene información del usuario');
    }

    return data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

export const register = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}user/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud de registro');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al registrar:', error);
    throw error;
  }
};

export const fetchSocioDemographics = async (token) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/socio-demograficos/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos socio-demográficos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener datos socio-demográficos:', error);
    throw error;
  }
};


export const fetchSocioDemographicsById = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/socio-demograficos/${id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos socio-demográficos por ID');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener datos socio-demográficos por ID:', error);
    throw error;
  }
};

export const submitSocioDemographics = async (token, data) => {
  try {
    const response = await fetch(`${API_URL}questions/socio-demograficos/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al enviar datos socio-demográficos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar datos socio-demográficos:', error);
    throw error;
  }
};

export const checkIfFormSubmitted = async (token) => {
  try {
    const response = await fetch(`${API_URL}questions/check-submission/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al verificar el envío de los formularios');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};



export const isAdmin = async (token) => {
  try {
    const response = await fetch(`${API_URL}user/is-admin/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al verificar si es administrador');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al verificar si es administrador:', error);
    throw error;
  }
};


export const submitDiagnosticoSjogren = async (token, data) => {
  try {
    const response = await fetch(`${API_URL}questions/sindrome/diagnostico/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al enviar los datos del diagnóstico de Sjögren');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar los datos del diagnóstico de Sjögren:', error);
    throw error;
  }
};


export const submitPoliautoinmunidad = async (token, data) => {
  try {
    const response = await fetch(`${API_URL}questions/sindrome/poliautoinmunidad/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al enviar datos de poliautoinmunidad');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar datos de poliautoinmunidad:', error);
    throw error;
  }
};



export const submitAntecedentesFamiliares = async (token, data) => {
  try {
    const response = await fetch(`${API_URL}questions/sindrome/antecedentes/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al enviar los datos de antecedentes familiares');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar los datos de antecedentes familiares:', error);
    throw error;
  }
};


export const submitAntecedentesMedicos = async (token, data) => {
  try {
    const response = await fetch(`${API_URL}questions/historia/antecedentes/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al enviar los datos de antecedentes médicos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar los datos de antecedentes médicos:', error);
    throw error;
  }
};


export const submitAlergias = async (token, data) => {
  try {
    const response = await fetch(`${API_URL}questions/historia/alergias/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al enviar los datos de antecedentes médicos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar los datos de antecedentes médicos:', error);
    throw error;
  }
};


export const submitEstadoMenstrual = async (token, data) => {
  try {
    const response = await fetch(`${API_URL}questions/historia/menstruacion/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al enviar los datos de antecedentes médicos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar los datos de antecedentes médicos:', error);
    throw error;
  }
};



export const submitHabitosNocivos = async (token, data) => {
  try {
    const response = await fetch(`${API_URL}questions/historia/habitos/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al enviar los datos de antecedentes médicos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar los datos de antecedentes médicos:', error);
    throw error;
  }
};


export const submitESSPRI = async (token, data) => {
  try {
    const response = await fetch(`${API_URL}questions/sintomas/esspri/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al enviar los datos de antecedentes médicos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar los datos de antecedentes médicos:', error);
    throw error;
  }
};

export const submitXerostomia = async (token, data) => {
  try {
    const response = await fetch(`${API_URL}questions/sintomas/xerostomia/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al enviar los datos de antecedentes médicos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar los datos de antecedentes médicos:', error);
    throw error;
  }
};

export const submitSindromeBocaArdiente = async (token, data) => {
  try {
    const response = await fetch(`${API_URL}questions/sintomas/boca_ardiente/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al enviar los datos de antecedentes médicos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar los datos de antecedentes médicos:', error);
    throw error;
  }
};


export const fetchDiagnosticoSjogrenById = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/sindrome/diagnostico-sjogren/${id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el diagnóstico de Sjogren por ID');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener el diagnóstico de Sjogren por ID:', error);
    throw error;
  }
};

export const fetchDiagnosticoSjogren = async (token) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/sindrome/diagnostico-sjogren/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los diagnósticos de Sjogren');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los diagnósticos de Sjogren:', error);
    throw error;
  }
};

export const fetchPoliautoinmunidadById = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/sindrome/poliautoinmunidad/${id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener la poliautoinmunidad por ID');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener la poliautoinmunidad por ID:', error);
    throw error;
  }
};

export const fetchPoliautoinmunidad = async (token) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/sindrome/poliautoinmunidad/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las poliautoinmunidades');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener las poliautoinmunidades:', error);
    throw error;
  }
};

export const fetchAntecedentesFamiliaresById = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/sindrome/antecedentes-familiares/${id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los antecedentes familiares por ID');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los antecedentes familiares por ID:', error);
    throw error;
  }
};

export const fetchAntecedentesFamiliares = async (token) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/sindrome/antecedentes-familiares/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los antecedentes familiares');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los antecedentes familiares:', error);
    throw error;
  }
};

export const fetchAntecedentesMedicosById = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/historia/antecedentes-medicos/${id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los antecedentes médicos por ID');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los antecedentes médicos por ID:', error);
    throw error;
  }
};

export const fetchAntecedentesMedicos = async (token) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/historia/antecedentes-medicos/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los antecedentes médicos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los antecedentes médicos:', error);
    throw error;
  }
};

export const fetchAlergiasById = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/historia/alergias/${id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las alergias por ID');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener las alergias por ID:', error);
    throw error;
  }
};

export const fetchAlergias = async (token) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/historia/alergias/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las alergias');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener las alergias:', error);
    throw error;
  }
};

export const fetchEstadoMenstrualById = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/historia/estado-menstrual/${id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el estado menstrual por ID');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener el estado menstrual por ID:', error);
    throw error;
  }
};

export const fetchEstadoMenstrual = async (token) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/historia/estado-menstrual/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el estado menstrual');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener el estado menstrual:', error);
    throw error;
  }
};

export const fetchHabitosNocivosById = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/historia/habitos-nocivos/${id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los hábitos nocivos por ID');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los hábitos nocivos por ID:', error);
    throw error;
  }
};

export const fetchHabitosNocivos = async (token) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/historia/habitos-nocivos/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los hábitos nocivos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los hábitos nocivos:', error);
    throw error;
  }
};

export const fetchESSPRIById = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/sintomas/esspri/${id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener ESSPRI por ID');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener ESSPRI por ID:', error);
    throw error;
  }
};

export const fetchESSPRI = async (token) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/sintomas/esspri/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener ESSPRI');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener ESSPRI:', error);
    throw error;
  }
};

export const fetchXerostomiaById = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/sintomas/xerostomia/${id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener la xerostomía por ID');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener la xerostomía por ID:', error);
    throw error;
  }
};

export const fetchXerostomia = async (token) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/sintomas/xerostomia/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener la xerostomía');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener la xerostomía:', error);
    throw error;
  }
};

export const fetchSindromeBocaArdienteById = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/sintomas/sindrome-boca-ardiente/${id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el síndrome de boca ardiente por ID');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener el síndrome de boca ardiente por ID:', error);
    throw error;
  }
};

export const fetchSindromeBocaArdiente = async (token) => {
  try {
    const response = await fetch(`${API_URL}questions/admin/sintomas/sindrome-boca-ardiente/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el síndrome de boca ardiente');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener el síndrome de boca ardiente:', error);
    throw error;
  }
};



