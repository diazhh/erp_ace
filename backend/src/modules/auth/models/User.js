const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      validate: {
        len: [3, 50],
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'last_name',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    lastLogin: {
      type: DataTypes.DATE,
      field: 'last_login',
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      field: 'password_changed_at',
    },
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
          user.passwordChangedAt = new Date();
        }
      },
    },
  });

  // Método de instancia para comparar contraseñas
  User.prototype.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  // Método de instancia para obtener datos públicos
  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  // Método para verificar si el password cambió después de emitir el token
  User.prototype.changedPasswordAfter = function(jwtTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return jwtTimestamp < changedTimestamp;
    }
    return false;
  };

  return User;
};
