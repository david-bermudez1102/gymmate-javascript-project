class AccountSerializer < ActiveModel::Serializer
  attributes :id, :name, :lastname, :bio, :date_of_birth, :sex, :username, :email, :userable_type, :userable_id
  attributes :message

  def message
    "success"
  end

end
