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
      "/api/standard/{standardId}": {
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
      "/api/chapters": {
      get: {
        summary: "Get all chapters",
        description: "Fetches a list of all chapters from the database.",
        tags: ["Chapters"],
        responses: {
          "200": {
            description: "Successfully retrieved chapters.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    chapters: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "6772a8c2bc41879fdd607493",
                          },
                          standard: {
                            type: "string",
                            example: "6772a873bc41879fdd60748d",
                          },
                          title: {
                            type: "string",
                            example: "Introduction to Trigonometry",
                          },
                          description: {
                            type: "string",
                            example: "This chapter covers the basics of trigonometry and their operations.",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Failed to retrieve chapter information.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Failed to retrieve the chapter information",
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new chapter",
        description: "Creates a new chapter in the database associated with a specific standard.",
        tags: ["Chapters"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "standardId"],
                properties: {
                  title: {
                    type: "string",
                    example: "Introduction to Trigonometry",
                  },
                  description: {
                    type: "string",
                    example: "This chapter covers the basics of trigonometry and their operations.",
                  },
                  standardId: {
                    type: "string",
                    example: "6772a873bc41879fdd60748d",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Chapter created successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Chapter created successfully",
                    },
                    chapter: {
                      type: "object",
                      properties: {
                        _id: {
                          type: "string",
                          example: "6772a8c2bc41879fdd607493",
                        },
                        title: {
                          type: "string",
                          example: "Introduction to Trigonometry",
                        },
                        description: {
                          type: "string",
                          example: "This chapter covers the basics of trigonometry and their operations.",
                        },
                        standard: {
                          type: "string",
                          example: "6772a873bc41879fdd60748d",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Missing title or standard ID.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Title and Standard ID are required",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Standard ID not found.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "The provided Standard ID does not exist",
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Failed to create chapter.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Failed to create chapter",
                    },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete a chapter by ID",
        description: "Deletes a chapter along with related exercises and questions from the database.",
        tags: ["Chapters"],
        parameters: [
          {
            in: "query",
            name: "id",
            required: true,
            schema: {
              type: "string",
            },
            description: "The ID of the chapter to be deleted.",
          },
        ],
        responses: {
          "200": {
            description: "Chapter and related data deleted successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Chapter and related data deleted successfully",
                    },
                    chapterId: {
                      type: "string",
                      example: "6772a8c2bc41879fdd607493",
                    },
                    deletedExercises: {
                      type: "array",
                      items: {
                        type: "string",
                        example: "exerciseId1",
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Missing chapter ID.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Chapter ID is required",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Chapter not found.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Chapter not found",
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Failed to delete chapter and related data.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Failed to delete chapter and related data",
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
  components: {
    schemas: {
      Chapter: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "6772a8c2bc41879fdd607493",
          },
          standard: {
            type: "string",
            example: "6772a873bc41879fdd60748d",
          },
          title: {
            type: "string",
            example: "Introduction to Trigonometry",
          },
          description: {
            type: "string",
            example: "This chapter covers the basics of trigonometry and their operations.",
          },
        },
      },
    },
      "/api/chapters/{chapterId}": {
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
      "/api/standard": {
        get: {
          summary: "Retrieve all classes (standards)",
          description: "Fetches a list of all classes (standards) along with their details such as standard name and description.",
          tags: ["Standards"],
          responses: {
            "200": {
              description: "Successfully retrieved all classes.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      classes: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            _id: {
                              type: "string",
                              example: "676f580403831da26a228fb6",
                            },
                            standardName: {
                              type: "integer",
                              example: 2,
                            },
                            description: {
                              type: "string",
                              example: "Grade 2 - Advanced concepts",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Failed to retrieve classes.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "Failed to retrieve the Classes Information",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a new standard",
          description: "Adds a new standard (class) with its name and description.",
          tags: ["Standards"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    standardName: {
                      type: "integer",
                      example: 10,
                    },
                    description: {
                      type: "string",
                      example: "This is the standard for students in grade 10.",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Successfully created the standard.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Standard created successfully",
                      },
                      standard: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "6772a873bc41879fdd60748d",
                          },
                          standardName: {
                            type: "integer",
                            example: 10,
                          },
                          description: {
                            type: "string",
                            example: "This is the standard for students in grade 10.",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Missing or invalid data.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "Standard name is required",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Failed to create the standard.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "Failed to create standard",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        delete: {
          summary: "Delete a standard and related data",
          description: "Deletes a specific standard by standardId and removes all related chapters, exercises, and questions.",
          tags: ["Standards"],
          parameters: [
            {
              in: "query",
              name: "standardId",
              required: true,
              description: "The ID of the standard to delete.",
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            "200": {
              description: "Successfully deleted the standard and related data.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Standard and related data deleted successfully",
                      },
                    },
                  },
                },
              },
            },
            "404": {
              description: "Standard not found.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "Id not Found",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Failed to delete the standard and related data.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "Failed to delete standard and related data",
                      },
                    },
                  },
                },
              },
            },
          },
        },
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
      '/api/questions': {
      get: {
        tags: ["Questions"],
        summary: 'Get all questions',
        description: 'Fetches all questions from the database, including associated exercise, chapter, and standard details.',
        responses: {
          200: {
            description: 'Successfully retrieved questions.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    questions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          _id: { type: 'string' },
                          questionText: { type: 'string' },
                          questionType: { type: 'string' },
                          answerFormat: { type: 'string' },
                          options: { type: 'array', items: { type: 'string' } },
                          numericalAnswer: { type: 'number' },
                          exerciseTitle: { type: 'string' },
                          exerciseDescription: { type: 'string' },
                          exerciseId: { type: 'string' },
                          chapterTitle: { type: 'string' },
                          chapterDescription: { type: 'string' },
                          chapterId: { type: 'string' },
                          standardName: { type: 'string' },
                          standardDescription: { type: 'string' },
                          standardId: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Failed to fetch questions.',
          },
        },
      },
      post: {
        summary: 'Add a new question',
        description: 'Adds a new question to the database with references to standard, chapter, and exercise.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['standard', 'chapter', 'exercise', 'questionText', 'questionType', 'answerFormat', 'correctAnswer'],
                properties: {
                  standard: { type: 'string' },
                  chapter: { type: 'string' },
                  exercise: { type: 'string' },
                  questionText: { type: 'string' },
                  questionType: { type: 'string' },
                  answerFormat: { type: 'string' },
                  options: { type: 'array', items: { type: 'string' } },
                  correctAnswer: { type: 'string' },
                  numericalAnswer: { type: 'number' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Question added successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    question: {
                      type: 'object',
                      properties: {
                        _id: { type: 'string' },
                        questionText: { type: 'string' },
                        questionType: { type: 'string' },
                        answerFormat: { type: 'string' },
                        options: { type: 'array', items: { type: 'string' } },
                        numericalAnswer: { type: 'number' },
                        exercise: { type: 'string' },
                        chapter: { type: 'string' },
                        standard: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required fields.',
          },
          500: {
            description: 'Failed to add question.',
          },
        },
      },
      delete: {
        summary: 'Delete a question',
        description: 'Deletes a question by ID from the database.',
        parameters: [
          {
            name: 'id',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'The ID of the question to delete.',
          },
        ],
        responses: {
          200: {
            description: 'Question deleted successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing question ID.',
          },
          404: {
            description: 'Question not found.',
          },
          500: {
            description: 'Failed to delete question.',
          },
        },
      },
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
