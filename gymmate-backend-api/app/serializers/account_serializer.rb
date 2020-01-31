class AccountSerializer < ActiveModel::Serializer
  attributes :id, :name, :lastname, :date_of_birth, :sex, :username, :email, :userable_type, :userable_id, :auth_token
  attributes :message

  def message
    "success"
  end
end
