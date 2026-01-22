export const getAlerts = async (req, res) => {
  const apiClient = req.apiUser;

  const alerts = await prisma.alert.findMany({
    where: { api_client_id: apiClient.id },
    include: {
      customer: true
    },
    orderBy: { created_at: 'desc' }
  });

  return res.json(alerts);
};


export const getAlertById = async (req, res) => {
  const apiClient = req.apiUser;
  const { id } = req.params;

  const alert = await prisma.alert.findFirst({
    where: {
      id,
      api_client_id: apiClient.id
    },
    include: {
      customer: true
    }
  });

  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }

  return res.json(alert);
};


export const getAlertsBySeverity = async (req, res) => {
  const apiClient = req.apiUser;
  const { severity } = req.params;

  const alerts = await prisma.alert.findMany({
    where: {
      api_client_id: apiClient.id,
      severity: severity.toUpperCase()
    },
    include: {
      customer: true
    },
    orderBy: { created_at: 'desc' }
  });
};

export const getAlertsByStatus = async (req, res) => {
  const apiClient = req.apiUser;
  const { status } = req.params;

  const alerts = await prisma.alert.findMany({
    where: {
      api_client_id: apiClient.id,
      status: status.toUpperCase()
    },
    include: {
      customer: true
    },
    orderBy: { created_at: 'desc' }
  });

  return res.json(alerts);
}

export const getAllAlertsBySeverity = async (req, res) => {
  const apiClient = req.apiUser;
  const levels = req.query.levels
    ?.split(',')
    .map(l => l.trim().toUpperCase());

  if (!levels?.length) {
    return res.status(400).json({ error: 'Severity levels required' });
  }

  const alerts = await prisma.alert.findMany({
    where: {
      api_client_id: apiClient.id,
      severity: { in: levels }
    },
    include: {
      customer: true
    },
    orderBy: { created_at: 'desc' }
  });

  return res.json(alerts);
};


export const getAllAlertsByStatus = async (req, res) => {
  const apiClient = req.apiUser;
  const statuses = req.query.values
    ?.split(',')
    .map(s => s.trim().toUpperCase());

  if (!statuses?.length) {
    return res.status(400).json({ error: 'Statuses required' });
  }

  const alerts = await prisma.alert.findMany({
    where: {
      api_client_id: apiClient.id,
      status: { in: statuses }
    },
    include: {
      customer: true
    },
    orderBy: { created_at: 'desc' }
  });

  return res.json(alerts);
};
