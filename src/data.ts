import { Program, Testimonial, Badge, MentorSession, LeaderboardUser, RoadmapNode } from './types';

export const DOMAINS = ['All', 'CSE', 'ECE', 'Mechanical', 'Civil', 'AI & ML', 'Embedded', 'IoT', 'Robotics'] as const;

export const PROGRAMS: Program[] = [
  {
    id: 'prog-ai-robotics',
    title: 'Autonomous Robotics & AI Integration',
    domain: 'Robotics',
    duration: '12 Weeks',
    difficulty: 'Advanced',
    techStack: ['ROS2', 'Python', 'C++', 'OpenCV', 'Gazebo Sim', 'SLAM'],
    liveProject: true,
    enrollmentPercentage: 88,
    mentorName: 'Dr. Arjun Mehta',
    mentorRole: 'Lead Robotics Scientist at Neuromorphic Labs',
    mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    description: 'Design, simulate, and configure real-world autonomous path planning algorithms. Deploy SLAM and advanced computer vision modules into simulated environments.',
    curriculum: [
      'Week 1-2: Mechanical kinematics and differential drive geometry',
      'Week 3-5: ROS2 nodes, pub/sub topics, services, and action client design',
      'Week 6-8: Lidar SLAM, Gmapping, and spatial point-cloud processing',
      'Week 9-12: Capstone deployment - autonomous warehouse rover simulation'
    ],
    price: 5000
  },
  {
    id: 'prog-edge-ml',
    title: 'Deep Learning & Edge Computing deployment',
    domain: 'AI & ML',
    duration: '10 Weeks',
    difficulty: 'Advanced',
    techStack: ['PyTorch', 'TensorFlow Lite', 'Docker', 'CUDA', 'Python'],
    liveProject: true,
    enrollmentPercentage: 92,
    mentorName: 'Shreya Iyer',
    mentorRole: 'Senior ML Infrastructure Engineer at CloudScale',
    mentorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    description: 'Train highly optimized CNNs and transformers, compress models through pruning/quantization, and deploy onto hardware platforms like Raspberry Pi and Jetson Nano.',
    curriculum: [
      'Week 1-2: Convolutions, activation math, and model architectures',
      'Week 3-4: Quantitative post-training analysis and model pruning',
      'Week 5-7: Edge runtime configuration with ONNX and TensorRT',
      'Week 8-10: Real-time neural inference streaming over camera feeds'
    ],
    price: 5500
  },
  {
    id: 'prog-embedded-rtos',
    title: 'Industrial IoT & RTOS Kernel Firmware',
    domain: 'Embedded',
    duration: '8 Weeks',
    difficulty: 'Intermediate',
    techStack: ['ESP32-S3', 'FreeRTOS', 'C (Embedded)', 'MQTT', 'SPI/I2C', 'Logic Analyzers'],
    liveProject: true,
    enrollmentPercentage: 79,
    mentorName: 'Karan Malhotra',
    mentorRole: 'Silicon Firmware Architect at CoreMicro Systems',
    mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.7,
    description: 'Master preemptive task scheduling, design semaphore guards, and build interrupt-driven drivers for peripheral devices inside a microsecond-sensitive environment.',
    curriculum: [
      'Week 1-2: Hardware architectures, registers, and bare-metal pointers',
      'Week 3-4: RTOS task preemption, scheduling ticks, and queue routing',
      'Week 5-6: Analog to Digital conversion, DMA pipelines, and memory pools',
      'Week 7-8: Fleet IoT telemetry security and standard OTA update pipelines'
    ],
    price: 4500
  },
  {
    id: 'prog-next-web',
    title: 'Full-Stack Distributed Systems Engineering',
    domain: 'CSE',
    duration: '12 Weeks',
    difficulty: 'Intermediate',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis Cores', 'GraphQL'],
    liveProject: false,
    enrollmentPercentage: 95,
    mentorName: 'Anshul Sharma',
    mentorRole: 'Staff Software Architect at HyperScale Group',
    mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    description: 'Deploy real-time transaction channels, establish cache-aside patterns, optimize database queries, & construct reactive event-driven state streams.',
    curriculum: [
      'Week 1-3: Relational schemas, indexing strategies, and database connection pools',
      'Week 4-6: Session tokens, security architectures, and rate dispensers',
      'Week 7-9: Cache layering with Redis and multi-client PubSub events',
      'Week 10-12: Zero-downtime containerized CI/CD cloud distribution systems'
    ],
    price: 6000
  },
  {
    id: 'prog-fea-mech',
    title: 'Automotive Design & Static Structural FEA',
    domain: 'Mechanical',
    duration: '10 Weeks',
    difficulty: 'Intermediate',
    techStack: ['SolidWorks', 'ANSYS', 'CATIA', 'Finite Element Analysis', 'Von Mises'],
    liveProject: true,
    enrollmentPercentage: 68,
    mentorName: 'Rajesh Varma',
    mentorRole: 'Lead Powertrain Structurist at AeroGlide Dynamics',
    mentorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    rating: 4.6,
    description: 'Assess mechanical chassis stresses and deformation profiles under high-load static conditions. Understand material shear indices & load distribution limits.',
    curriculum: [
      'Week 1-3: 3D spline and parametric design in SolidWorks',
      'Week 4-6: Meshing geometries, convergence thresholds, and shell mesh vs solid mesh',
      'Week 7-8: Von-Mises yield boundaries under thermal and dynamic pressures',
      'Week 9-10: Mechanical safety factors and mass-reduction optimization runs'
    ],
    price: 4800
  },
  {
    id: 'prog-bim-civil',
    title: 'Infrastructure BIM Modeling & Structural Analysis',
    domain: 'Civil',
    duration: '8 Weeks',
    difficulty: 'Beginner',
    techStack: ['Autodesk Revit', 'STAAD.Pro', 'BIM Level 2', 'Concrete Codes'],
    liveProject: false,
    enrollmentPercentage: 62,
    mentorName: 'Priya Deshmukh',
    mentorRole: 'Director of BIM Operations at Metropole Design',
    mentorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: 4.5,
    description: 'Create multi-dimensional building information models matching international engineering codes. Calculate lateral wind pressures & shear walls metrics.',
    curriculum: [
      'Week 1-2: Spatial layout modeling and wall material mapping',
      'Week 3-4: Multi-coordinate system management and clash-detection runs',
      'Week 5-6: Beam deflection and concrete reinforcement vector analysis',
      'Week 7-8: Scheduling quantities, material logistics, and site layout mapping'
    ],
    price: 3500
  },
  {
    id: 'prog-smart-iot',
    title: 'Microgrid Energy Management & Smart IoT Mesh',
    domain: 'IoT',
    duration: '10 Weeks',
    difficulty: 'Advanced',
    techStack: ['ESP-NOW Mesh', 'Grafana', 'InfluxDB', 'PWM Converters', 'IEEE 802.15.4'],
    liveProject: true,
    enrollmentPercentage: 74,
    mentorName: 'Vikram Rao',
    mentorRole: 'Smart Systems Designer at GridSolar Energy',
    mentorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    description: 'Devise self-healing network nodes tracking solar converters. Model power dissipation grids and packet loss curves across multi-node topologies.',
    curriculum: [
      'Week 1-3: Low-power state sleep configs, battery profiles, and solar charges',
      'Week 4-5: Self-healing mesh routing protocols (ESP-NOW and Thread standards)',
      'Week 6-8: Building real-world sub-second telemetry dashboards with InfluxDB and Grafana',
      'Week 9-10: Deploying deep power consumption alerts over encrypted radio channels'
    ],
    price: 4200
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Tejas Kushwaha',
    college: 'IIT Kharagpur',
    domain: 'Autonomous Robotics',
    quote: 'The simulations on ROS2 path-finding let me feel like an actual aerospace engineer. Best platform structure I have ever utilized.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 't2',
    name: 'Sneha Reddy',
    college: 'VIT Vellore',
    domain: 'Embedded RTOS',
    quote: 'Configuring direct DMA transfers under FreeRTOS was thrilling. Mentors respond with hardware logic traces and exact advice!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 't3',
    name: 'Kartik Iyer',
    college: 'NIT Trichy',
    domain: 'AI & Edge Computing',
    quote: 'The model quantization pipeline we built actually fit my neural net inside the microcontroller SRAM constraints. Incredible curriculum!',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 't4',
    name: 'Ananya Sen',
    college: 'DTU Delhi',
    domain: 'Full-Stack Distributed Systems',
    quote: 'We created real-time lock contention tests that pushed our server databases past 1500 concurrent connections. A true showcase piece!',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80'
  }
];

export const BADGES: Badge[] = [
  {
    id: 'b1',
    name: 'Core Compiler',
    description: 'First successful task submission with perfect code formatting.',
    iconName: 'CodeXml',
    unlocked: true,
    color: '#3B82F6',
    xpValue: 100
  },
  {
    id: 'b2',
    name: 'Edge Commander',
    description: 'Configured a full RTOS preemptive queue loop target.',
    iconName: 'Cpu',
    unlocked: true,
    color: '#06B6D4',
    xpValue: 250
  },
  {
    id: 'b3',
    name: 'Neural Architect',
    description: 'Completed model quantization step with under 5% accuracy drop.',
    iconName: 'Brain',
    unlocked: true,
    color: '#8B5CF6',
    xpValue: 400
  },
  {
    id: 'b4',
    name: 'Autonomous Rover',
    description: 'Calculated laser vector bounds correctly for the path planner rover.',
    iconName: 'Compass',
    unlocked: false,
    color: '#10B981',
    xpValue: 500
  },
  {
    id: 'b5',
    name: 'Mega Mesh',
    description: 'Establish a self-healing mesh with 8 routing nodes.',
    iconName: 'Radio',
    unlocked: false,
    color: '#F59E0B',
    xpValue: 600
  }
];

export const MENTOR_SESSIONS: MentorSession[] = [
  {
    id: 's1',
    title: 'Model Quantization and Floating-Point Compression',
    mentor: 'Shreya Iyer',
    time: 'Today, 06:30 PM IST',
    timestamp: new Date().toISOString(),
    rsvpCount: 142,
    xpAward: 150
  },
  {
    id: 's2',
    title: 'Kinematics Dynamics Simulation in ROS2 & Gazebo',
    mentor: 'Dr. Arjun Mehta',
    time: 'Tomorrow, 04:00 PM IST',
    timestamp: new Date(Date.now() + 86400000).toISOString(),
    rsvpCount: 204,
    xpAward: 200
  },
  {
    id: 's3',
    title: 'FreeRTOS Task Safety and Priority Inversion Solutions',
    mentor: 'Karan Malhotra',
    time: 'May 25, 05:30 PM IST',
    timestamp: new Date(Date.now() + 86400000 * 3).toISOString(),
    rsvpCount: 88,
    xpAward: 120
  }
];

export const LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Satyajit Ray', college: 'IIT Bombay', xp: 4850, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'Pranav Saxena', college: 'BITS Pilani', xp: 4420, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'Rohan Sharma (You)', college: 'Delhi College of Engineering', xp: 4150, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', isCurrentUser: true },
  { rank: 4, name: 'Megha Nair', college: 'VIT Chennai', xp: 3950, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { rank: 5, name: 'Rayan Chawla', college: 'IIT Madras', xp: 3700, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
];

export const ROADMAP_NODES: RoadmapNode[] = [
  {
    id: 'w1-2',
    week: 'Week 1-2',
    title: 'Kinematics Dynamics & Mathematical Modeling',
    description: 'Calculate matrix transformations, yaw curves, and angular drift vectors for a differential rover chassis.',
    status: 'completed',
    xpReward: 300,
    skillsAcquired: ['Matrix Transformation', 'URDF Configuration', 'Joint Physics'],
    projects: ['Robot Splining Geometry Map']
  },
  {
    id: 'w3-5',
    week: 'Week 3-5',
    title: 'ROS 2 Inter-Process Architecture & Telemetry Routing',
    description: 'Write custom C++ publishers, action service limits, and filter LiDAR distance clusters efficiently.',
    status: 'in-progress',
    xpReward: 450,
    skillsAcquired: ['ROS2 Node Pipeline', 'Custom MSG Interfaces', 'Multi-Threading Execctors'],
    projects: ['Laser Distance Alarm Node', 'State Telemetry Action Gateway']
  },
  {
    id: 'w6-8',
    week: 'Week 6-8',
    title: 'Autonomous Navigation, SLAM & Costmaps',
    description: 'Integrate Nav2 configurations, program dynamic hazard inflation layers, and configure AMCL localization parameters.',
    status: 'locked',
    xpReward: 500,
    skillsAcquired: ['Cartographer SLAM', 'Dynamic Inflation Bounds', 'Path Spline Tuning'],
    projects: ['Industrial Warehouse Floor Map Generation']
  },
  {
    id: 'w9-10',
    week: 'Week 9-10',
    title: 'Edge AI Object Identification & Visual Feedback',
    description: 'Compress model weights through FP16 quantization. Configure hardware acceleration registers on embedded units.',
    status: 'locked',
    xpReward: 600,
    skillsAcquired: ['TensorRT Engines', 'Camera Inference Pipelines', 'Quantization Math'],
    projects: ['Live Target tracking model calibration']
  },
  {
    id: 'w11-12',
    week: 'Week 11-12',
    title: 'Multi-Agent Drone Coordination (Capstone Project)',
    description: 'Combine SLAM data, path planners, and radio relays in a multi-agent grid topology matching high reliability guidelines.',
    status: 'locked',
    xpReward: 1000,
    skillsAcquired: ['Distributed Kinematics', 'Wireless Network Security', 'Fail-Safe Automation'],
    projects: ['Flock Simulation Hub']
  }
];
