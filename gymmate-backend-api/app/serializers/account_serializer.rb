class AccountSerializer < ActiveModel::Serializer
  attributes :name, :lastname, :date_of_birth
end
