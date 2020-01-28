class AccountSerializer < ActiveModel::Serializer
  attributes :name, :lastname, :date_of_birth, :auth_token
  attributes :message

  def message
    "success"
  end

end
