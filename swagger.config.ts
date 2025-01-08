export const swaggerConfig = {
  apiFolder: "app/api",
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pariksha Mitra API Documentation",
      version: "1.0.0",
      description:
        "API documentation for the Pariksha Mitra educational platform",
    },
    servers: [
      {
        url: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            data: {
              type: "object",
              nullable: true,
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Validation failed",
            },
            data: {
              type: "object",
              properties: {
                errors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      path: {
                        type: "string",
                        example: "schoolId",
                      },
                      message: {
                        type: "string",
                        example: "School ID is required",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    paths: {
      "/api/standards/{standardId}": {
    get: {
      tags: ["Standards"],
      summary: "Get a standard and its related chapters, exercises, and questions",
      description: "Retrieve a standard by its ID along with its associated chapters, exercises, and questions.",
      parameters: [
        {
          name: "standardId",
          in: "path",
          required: true,
          description: "The ID of the standard to retrieve.",
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        200: {
          description: "Successfully retrieved the standard with its related data.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean"
                  },
                  standard: {
                    $ref: "#/components/schemas/Standard"
                  }
                }
              }
            }
          }
        },
        400: {
          description: "StandardId is required."
        },
        404: {
          description: "Standard not found."
        },
        500: {
          description: "Failed to fetch the standard data."
        }
      }
    }
  },
      "/api/classes": {
        get: {
          tags: ["Classes"],
          summary: "Get all classes (standards)",
          description: "Retrieve all the available standards (classes).",
          responses: {
            200: {
              description: "Successfully retrieved all classes.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      classes: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Standard"
                        }
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: "Failed to retrieve classes."
            }
          }
        },
        post: {
          tags: ["Classes"],
          summary: "Create a new class (standard)",
          description: "Create a new class (standard) by providing its name and description.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    standardName: {
                      type: "string",
                      description: "Name of the standard (class)."
                    },
                    description: {
                      type: "string",
                      description: "Description of the standard (class)."
                    }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: "Successfully created a new standard.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string"
                      },
                      standard: {
                        $ref: "#/components/schemas/Standard"
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: "Standard name is required."
            },
            500: {
              description: "Failed to create the standard."
            }
          }
        },
        delete: {
          tags: ["Classes"],
          summary: "Delete a class (standard) and its related data",
          description: "Delete a class (standard) by providing its ID along with its related chapters, exercises, and questions.",
          parameters: [
            {
              name: "id",
              in: "query",
              required: true,
              description: "The ID of the standard (class) to delete.",
              schema: {
                type: "string"
              }
            }
          ],
          responses: {
            200: {
              description: "Successfully deleted the standard and related data."
            },
            404: {
              description: "Standard or related data not found."
            },
            500: {
              description: "Failed to delete standard and related data."
            }
          }
        }
      },
      "/api/exercises/{exerciseId}": {
        get: {
          tags: ["Exercises"],
          summary: "Get a single exercise by its ID",
          description: "Retrieve an exercise by its ID along with related details such as chapter and questions.",
          parameters: [
            {
              name: "exerciseId",
              in: "path",
              required: true,
              description: "The ID of the exercise to retrieve.",
              schema: {
                type: "string"
              }
            }
          ],
          responses: {
            200: {
              description: "Successfully retrieved the exercise.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      singleExercise: {
                        $ref: "#/components/schemas/Exercise"
                      }
                    }
                  }
                }
              }
            },
            404: {
              description: "Exercise not found."
            },
            500: {
              description: "Failed to retrieve the exercise."
            }
          }
        }
      },
      "/api/exercises": {
    get: {
      tags: ["Exercises"],
      summary: "Get all exercises",
      description: "Retrieve a list of all exercises.",
      responses: {
        200: {
          description: "Successfully retrieved the list of exercises.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  exercises: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Exercise"
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          description: "Failed to retrieve exercises."
        }
      }
    },
    post: {
      tags: ["Exercises"],
      summary: "Create a new exercise",
      description: "Create a new exercise and associate it with a chapter.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                chapterId: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: "Successfully created the exercise.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  exercise: {
                    $ref: "#/components/schemas/Exercise"
                  }
                }
              }
            }
          }
        },
        400: {
          description: "Title, description, and chapterId are required."
        },
        500: {
          description: "Failed to create the exercise."
        }
      }
    },
    delete: {
      tags: ["Exercises"],
      summary: "Delete an exercise by ID",
      description: "Delete a specific exercise by its ID and all related questions.",
      parameters: [
        {
          name: "id",
          in: "query",
          required: true,
          description: "The ID of the exercise to delete.",
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        200: {
          description: "Successfully deleted the exercise and its related questions.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  deletedExercise: {
                    $ref: "#/components/schemas/Exercise"
                  }
                }
              }
            }
          }
        },
        400: {
          description: "Exercise ID is required."
        },
        404: {
          description: "Exercise not found."
        },
        500: {
          description: "Failed to delete the exercise and related questions."
        }
      }
    }
  },
      "/api/chapter/{chapterId}": {
    get: {
      tags: ["Chapters"],
      summary: "Get a single chapter by ID",
      description: "Retrieve a single chapter by its ID from the database.",
      parameters: [
        {
          name: "chapterId",
          in: "path",
          required: true,
          description: "The ID of the chapter to retrieve.",
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        200: {
          description: "Successfully retrieved the chapter.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  singleChapter: {
                    $ref: "#/components/schemas/Chapter"
                  }
                }
              }
            }
          }
        },
        404: {
          description: "Chapter not found."
        },
        500: {
          description: "Failed to retrieve the chapter."
        }
      }
    }
  },
      "/api/chapters": {
    get: {
      tags: ["Chapters"],
      summary: "Get all chapters",
      description: "Retrieve all chapters from the database.",
      responses: {
        200: {
          description: "Successfully retrieved chapters.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  chapters: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Chapter"
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          description: "Failed to retrieve chapter information."
        }
      }
    },
    post: {
      tags: ["Chapters"],
      summary: "Create a new chapter",
      description: "Create a new chapter and associate it with a specific standard.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "standardId"],
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                standardId: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: "Chapter created successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  chapter: {
                    $ref: "#/components/schemas/Chapter"
                  }
                }
              }
            }
          }
        },
        400: {
          description: "Missing title or standard ID."
        },
        404: {
          description: "Standard ID not found."
        },
        500: {
          description: "Failed to create chapter."
        }
      }
    }
  },
  
  "/api/chapters/{chapterId}": {
    delete: {
      tags: ["Chapters"],
      summary: "Delete a chapter by ID",
      description: "Delete a chapter along with all related exercises and questions.",
      parameters: [
        {
          name: "chapterId",
          in: "path",
          required: true,
          description: "The ID of the chapter to be deleted.",
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        200: {
          description: "Chapter and related data deleted successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  chapterId: { type: "string" },
                  deletedExercises: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            }
          }
        },
        400: {
          description: "Missing chapter ID."
        },
        404: {
          description: "Chapter not found."
        },
        500: {
          description: "Failed to delete chapter and related data."
        }
      }
    }
  },
      "/api/questions/{questionId}": {
  get: {
    tags: ["Questions"],
    summary: "Get a single question by its ID",
    description: "Retrieve a question by its ID along with related details such as exercise, chapter, and standard.",
    parameters: [
      {
        in: "path",
        name: "questionId",
        required: true,
        schema: {
          type: "string",
        },
        description: "The ID of the question to retrieve.",
      },
    ],
    responses: {
      200: {
        description: "Successfully retrieved the question.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                singleQuestion: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    questionText: { type: "string" },
                    questionType: { type: "string" },
                    answerFormat: { type: "string" },
                    options: {
                      type: "array",
                      items: { type: "string" },
                    },
                    numericalAnswer: { type: "number" },
                    exerciseTitle: { type: "string" },
                    exerciseDescription: { type: "string" },
                    exerciseId: { type: "string" },
                    chapterTitle: { type: "string" },
                    chapterDescription: { type: "string" },
                    chapterId: { type: "string" },
                    standardName: { type: "string" },
                    standardDescription: { type: "string" },
                    standardId: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      404: {
        description: "Question not found.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
      500: {
        description: "Failed to retrieve the question due to a server error.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
},

      "/api/questions": {
    get: {
      tags: ["Questions"],
      summary: "Get a list of all questions with their related exercise, chapter, and standard data",
      description: "Retrieve all questions with their associated exercises, chapters, and standards.",
      responses: {
        200: {
          description: "Successfully retrieved all questions and their related data.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Question"
                    }
                  }
                }
              }
            }
          }
        },
        500: {
          description: "Failed to fetch the questions."
        }
      }
    },
    post: {
      tags: ["Questions"],
      summary: "Add a new question",
      description: "Add a new question to the database, including its standard, chapter, exercise, and other relevant details.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                standard: {
                  type: "string"
                },
                chapter: {
                  type: "string"
                },
                exercise: {
                  type: "string"
                },
                questionText: {
                  type: "string"
                },
                questionType: {
                  type: "string"
                },
                answerFormat: {
                  type: "string"
                },
                options: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                },
                correctAnswer: {
                  type: "string"
                },
                numericalAnswer: {
                  type: "number"
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Successfully added a new question.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string"
                  },
                  question: {
                    $ref: "#/components/schemas/Question"
                  }
                }
              }
            }
          }
        },
        400: {
          description: "Missing required fields."
        },
        500: {
          description: "Failed to add the question."
        }
      }
    },
    delete: {
      tags: ["Questions"],
      summary: "Delete a question by its ID",
      description: "Delete a question based on its ID.",
      parameters: [
        {
          name: "id",
          in: "query",
          required: true,
          description: "The ID of the question to delete.",
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        200: {
          description: "Successfully deleted the question."
        },
        400: {
          description: "Question ID is required."
        },
        404: {
          description: "Question not found."
        },
        500: {
          description: "Failed to delete the question."
        }
      }
    }
  },
      "/api/auth/signin": {
        post: {
          tags: ["Auth"],
          summary: "Sign in a user",
          description:
            "Allows a user to sign in using credentials or provider information.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: {
                      type: "string",
                      description: "User's username",
                    },
                    password: {
                      type: "string",
                      description: "User's password",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: {
                        type: "string",
                        description: "JWT token for authorization",
                      },
                      user: {
                        type: "object",
                        properties: {
                          id: { type: "string", description: "User ID" },
                          username: {
                            type: "string",
                            description: "Username of the logged-in user",
                          },
                          role: {
                            type: "string",
                            description:
                              "Role of the user (e.g., teacher, student)",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Invalid credentials",
            },
          },
        },
      },
      "/api/auth/session": {
        get: {
          tags: ["Auth"],
          summary: "Get user session",
          description: "Fetches the current session information.",
          responses: {
            200: {
              description: "Session information",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: {
                        type: "object",
                        properties: {
                          id: { type: "string", description: "User ID" },
                          username: {
                            type: "string",
                            description: "Username of the logged-in user",
                          },
                          role: {
                            type: "string",
                            description: "Role of the user",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized, session not found",
            },
          },
        },
      },
      "/api/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "firstName",
                    "surname",
                    "dateOfBirth",
                    "role",
                    "schoolId",
                  ],
                  properties: {
                    firstName: {
                      type: "string",
                      example: "John",
                    },
                    middleName: {
                      type: "string",
                      example: "Middle",
                    },
                    surname: {
                      type: "string",
                      example: "Doe",
                    },
                    dateOfBirth: {
                      type: "string",
                      format: "date",
                      example: "2000-01-01",
                    },
                    role: {
                      type: "string",
                      enum: ["teacher", "student"],
                      example: "teacher",
                    },
                    schoolId: {
                      type: "string",
                      example: "शाळा क्रमांक १",
                      description: "School identifier",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      description: "Required for teachers only",
                    },
                    invitationId: {
                      type: "string",
                      description: "Required for teachers only",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        example: true,
                      },
                      message: {
                        type: "string",
                        example: "User registered successfully!",
                      },
                      user: {
                        type: "object",
                        properties: {
                          username: {
                            type: "string",
                            example: "john@123",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ValidationError",
                  },
                },
              },
            },
            409: {
              description: "User already exists",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            500: {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
